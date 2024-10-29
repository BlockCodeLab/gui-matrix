import { useEffect, useState } from 'preact/hooks';
import { useLocale, useEditor } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks-editor';
import { BlocksPlayer, paperCore } from '@blockcode/blocks-player';
import { javascriptGenerator } from '../../generators/javascript';

import Runtime from './runtime';
import generate from './generate';
import createUtil from './target-util';

export default function ArcadePlayer({ stageSize, playing, onReady, onRequestStop }) {
  const [canvas, setCanvas] = useState(null);
  const [currentRuntime, setCurrentRuntime] = useState(false);
  const { language, maybeLocaleText } = useLocale();
  const { editor, fileList, assetList, selectedFileId, openFile, modifyFile } = useEditor();

  const zoomRatio = stageSize === 'small' ? 1 : 1.5;
  const viewSize = new paperCore.Size(Runtime.VIEW_WIDTH * zoomRatio, Runtime.VIEW_HEIGHT * zoomRatio);

  const updateTargetFromRaster = (raster, isStage = false) => {
    if (!raster || !raster.util) return;
    modifyFile(
      Object.assign(
        {
          id: raster.name,
        },
        isStage
          ? {
              frame: raster.util.backdrop - 1,
            }
          : {
              frame: raster.util.costume - 1,
              x: raster.util.x,
              y: raster.util.y,
              size: raster.util.size,
              direction: raster.util.direction,
              rotationStyle: raster.data.rotationStyle,
              hidden: !raster.visible,
              zIndex: raster.util.zIndex,
            },
      ),
    );
  };

  const setMouseUpHandler = (raster, id) => async (e) => {
    if (!raster.dragging) return;
    clearTimeout(raster.dragging);
    delete raster.dragging;

    raster.shadowColor = null;

    raster.util.goto(raster.position.x - paperCore.view.center.x, paperCore.view.center.y - raster.position.y);
    updateTargetFromRaster(raster);

    if (id !== selectedFileId) {
      openFile(id);
    }
  };

  const setSelected = (raster) => {
    if (raster.dragging !== true) {
      clearTimeout(raster.dragging);
    }
    raster.dragging = true;
    raster.bringToFront();
    raster.set({
      shadowColor: new paperCore.Color(0, 0, 0, 0.2),
      shadowBlur: 8,
    });
  };

  if (canvas) {
    const stageLayer = paperCore.project.layers.stage;
    const spriteLayer = paperCore.project.layers.sprite;
    const contourLayer = paperCore.project.layers.contour;
    const dialogLayer = paperCore.project.layers.dialog;

    if (playing) {
      spriteLayer.onMouseDown = null;
      if (!currentRuntime) {
        // start
        const runtime = new Runtime(
          language,
          onRequestStop,
          assetList.filter((asset) => asset.type === 'audio/wav'),
        );
        runtime.launch(generate(fileList));
        runtime.handleKeyDown = runtime.handleKeyDown.bind(runtime);
        runtime.handleKeyUp = runtime.handleKeyUp.bind(runtime);
        document.addEventListener('keydown', runtime.handleKeyDown);
        document.addEventListener('keyup', runtime.handleKeyUp);

        const workspace = ScratchBlocks.getMainWorkspace();
        if (workspace) {
          workspace.addChangeListener(onRequestStop);
        }
        setCurrentRuntime(runtime);
        onReady(runtime);
      }
    } else {
      if (currentRuntime) {
        // stop
        const workspace = ScratchBlocks.getMainWorkspace();
        if (workspace) {
          workspace.removeChangeListener(onRequestStop);
        }
        document.removeEventListener('keydown', currentRuntime.handleKeyDown);
        document.removeEventListener('keyup', currentRuntime.handleKeyUp);
        currentRuntime.stop().then(() => {
          stageLayer.removeChildren(1);
          dialogLayer.removeChildren();
          setCurrentRuntime(false);
        });
        onReady(null);
      } else {
        paperCore.view.viewSize = viewSize;
        paperCore.view.zoom = zoomRatio;

        spriteLayer.onMouseDown = (e) => {
          for (const hitTarget of spriteLayer.hitTestAll(e.point)) {
            if (hitTarget.item.getAverageColor(e.point)) {
              hitTarget.item.dragging = setTimeout(() => setSelected(hitTarget.item), 1000);
              return;
            }
          }
        };
        spriteLayer.onMouseDrag = (e) => {
          const raster = spriteLayer.children.find((child) => child.dragging);
          if (raster) {
            setSelected(raster);
            raster.position.x += e.delta.x;
            raster.position.y += e.delta.y;
          }
        };

        // edit
        fileList
          .toSorted((a, b) => a.zIndex - b.zIndex)
          .forEach(async (file, i) => {
            const isStage = i === 0;
            const layer = isStage ? stageLayer : spriteLayer;
            const assets = assetList.filter((asset) => file.assets.includes(asset.id));

            let raster = layer.children[file.id];
            if (!raster) {
              raster = layer.addChild(new paperCore.Raster());
              raster.name = file.id;
              raster.util = createUtil(raster, isStage);
              raster.util.on('update', () => updateTargetFromRaster(raster, isStage));
            }
            raster.data = {
              assets,
              name: maybeLocaleText(file.name),
            };

            if (isStage) {
              raster.util.backdrop = file.frame + 1;
            } else {
              raster.onMouseUp = setMouseUpHandler(raster, file.id);
              raster.util.costume = file.frame + 1;
              raster.util.x = file.x;
              raster.util.y = file.y;
              raster.util.size = file.size;
              raster.util.hidden = file.hidden;
              raster.util.direction = file.direction;
              raster.util.rotationStyle = file.rotationStyle;
            }
          });

        // remove clones and deleted sprties
        const removes = [];
        spriteLayer.children.forEach((child) => {
          if (fileList.find((file) => child.name === file.id)) return;
          removes.push(child);
        });
        // and contours
        contourLayer.children.forEach((child) => {
          if (fileList.find((file) => child.name === file.id)) return;
          removes.push(child);
        });
        removes.forEach((child) => {
          if (child.util) {
            child.util.remove();
          }
          child.remove();
        });
      }
    }
  }

  const handleSetup = (canvas) => {
    setCanvas(canvas);
    paperCore.view.viewSize = new paperCore.Size(Runtime.VIEW_WIDTH, Runtime.VIEW_HEIGHT);
    new paperCore.Layer({ name: 'stage' });
    new paperCore.Layer({ name: 'contour' });
    new paperCore.Layer({ name: 'sprite' });
    new paperCore.Layer({ name: 'dialog' });
    paperCore.project.layers.sprite.activate();
  };

  useEffect(() => onRequestStop(), [editor.activedTabIndex]);

  return (
    <BlocksPlayer
      width={`${viewSize.width}px`}
      height={`${viewSize.height}px`}
      generator={javascriptGenerator}
      onSetup={handleSetup}
      onClick={() => document.querySelectorAll('input:focus').forEach((e) => e.blur())}
    />
  );
}
