import { useCallback, useEffect } from 'preact/hooks';
import { batch } from '@preact/signals';
import { MathUtils, KonvaUtils } from '@blockcode/utils';
import { useAppContext, useProjectContext, setFile, isModifyType, ModifyTypes } from '@blockcode/core';
import { loadImageFromAsset } from '@blockcode/paint';
import { Emulator } from '@blockcode/blocks';
import { ArcadeRuntime } from '../../lib/runtime/runtime';
import { StageConfig, RotationStyle, SpriteDefaultConfig } from './emulator-config';

export function ArcadeEmulator({ runtime, onRuntime }) {
  const { splashVisible, appState } = useAppContext();

  const { files, assets, fileId, modified } = useProjectContext();

  // 运行模拟器
  useEffect(async () => {
    if (!runtime) return;

    // 启动
    if (appState.value?.running === true) {
      const code = files.value.map((res) => `((/*${res.name}*/) => {\n${res.script}})();`).join('\n\n');
      runtime.launch(`${code}\n\nruntime.start();`);
    }

    // 停止
    if (appState.value?.running === false) {
      if (runtime.running) {
        runtime.stop();
      }
    }
  }, [appState.value?.running]);

  // 模拟器编辑模式下切换角色时在舞台上高亮
  useEffect(() => {
    if (!runtime) return;
    if (appState.value?.running) return;

    // 添加新文件不高亮
    if (isModifyType(ModifyTypes.AddFile)) return;

    // 只有不在拖拽的角色高亮，背景不高亮
    const target = runtime.querySelector(`#${fileId}`);
    if (target?.draggable?.() && !target.isDragging()) {
      runtime.targetUtils.highlight(target);
    }
  }, [fileId.value]);

  // 模拟器编辑模式下更新
  useEffect(async () => {
    if (!runtime) return;

    if (splashVisible.value === true) {
      runtime.stop();
      runtime.backdropLayer.destroyChildren();
      runtime.paintLayer.destroyChildren();
      runtime.spritesLayer.destroyChildren();
      runtime.boardLayer.destroyChildren();
      return;
    }

    if (appState.value?.running) return;

    const targetUtils = runtime.targetUtils;

    let i, asset, image, scale, maxScale, direction;

    // 删除多余的角色
    for (const target of runtime.spritesLayer.children) {
      if (!files.value.find((res) => res.id === target.id())) {
        target.remove();
      }
    }

    // 更新所有角色和舞台
    for (i = 0; i < files.value.length; i++) {
      const data = files.value[i];
      const isStage = i === 0;

      // 添加角色或舞台
      let target = runtime.querySelector(`#${data.id}`);
      if (!target) {
        target = new Konva.Image({
          id: data.id,
          name: data.name,
          x: 0,
          y: 0,
          scaleY: runtime.stage.scaleY(),
          shadowBlur: 5,
          shadowColor: 'transparent',
          shadowOpacity: 0,
          draggable: i !== 0, // 角色允许拖拽
        });
        if (isStage) {
          runtime.backdropLayer.add(target);
          target.setAttr('fencingMode', data.fencing);
        } else {
          runtime.spritesLayer.add(target);

          // 角色拖拽事件
          // 激活角色
          target.on('dragstart', () => targetUtils.active(target));
          // 角色位置更新
          target.on('dragend', () => targetUtils.dragdrop(target, data.x, data.y));
        }
      }

      // 更新帧
      asset = assets.value.find((res) => res.id === data.assets[data.frame]);
      if (asset) {
        image = await loadImageFromAsset(asset);
        target.setAttrs({
          image,
          name: data.name,
          offsetX: asset.centerX,
          offsetY: asset.centerY,
          // 数据记录
          frames: data.assets,
          frameIndex: data.frame,
        });
        KonvaUtils.computeConvexHulls(target, image);
      }

      // 角色更新
      if (!isStage) {
        // 缩放最大不能超过屏幕且不能小于1，最小0.05
        maxScale = Math.min(runtime.stage.width() / image.width, runtime.stage.height() / image.height);
        scale = MathUtils.clamp(data.size / 100, 0.05, Math.max(1, maxScale));

        // 根据不同旋转方式产生不同旋转效果
        direction = MathUtils.wrapClamp(data.direction, -179, 180);
        if (data.rotationStyle === RotationStyle.HorizontalFlip) {
          // 镜像
          if (direction < 0) {
            scale = -scale;
          }
          direction = 90;
        }

        // 更新属性
        target.setAttrs({
          x: data.x,
          y: data.y,
          scaleX: scale,
          scaleY: runtime.stage.scaleY() * Math.abs(scale),
          rotation: SpriteDefaultConfig.Direction - direction,
          visible: !data.hidden,
          // 数据记录
          rotationStyle: data.rotationStyle,
          direction: data.direction,
          scaleSize: data.size,
        });
      }
      targetUtils.redraw(target);
    }

    // 调整 zIndex，zIndex必须在所有角色加载完成之后进行
    for (i = 0; i < files.value.length; i++) {
      const data = files.value[i];
      const target = runtime.querySelector(`#${data.id}`);
      if (target && typeof data.zIndex === 'number') {
        target.zIndex(MathUtils.clamp(data.zIndex, 0, runtime.spritesLayer.children.length - 1));
      }
    }
  }, [runtime, splashVisible.value, modified.value]);

  // 模拟器运行时不可编辑
  useEffect(() => {
    if (!runtime) return;
    runtime.stage.listening(!appState.value?.running);
  }, [runtime, appState.value?.running]);

  // 绑定项目库
  useEffect(() => {
    if (!runtime) return;
    runtime.binding(files.value, assets.value);
  }, [runtime, files.value, assets.value]);

  const handleRuntime = useCallback(
    (stage) => {
      // 更新数据
      const updateTarget = (target, runtime) => {
        if (splashVisible.value) return;

        // 强制关闭作品后，立即停止
        if (!files.value) {
          runtime.stop();
          return;
        }

        if (target) {
          const isStage = target.getLayer() === runtime.backdropLayer;
          batch(() => {
            const res = {
              id: target.id(),
              frame: target.getAttr('frameIndex'),
            };
            if (isStage) {
              res.fencing = target.getAttr('fencingMode');
            } else {
              res.x = Math.round(target.x());
              res.y = Math.round(target.y());
              res.size = Math.floor(target.getAttr('scaleSize'));
              res.direction = MathUtils.wrapClamp(Math.floor(target.getAttr('direction')), -179, 180);
              res.rotationStyle = target.getAttr('rotationStyle');
              res.hidden = !target.visible();
              res.zIndex = target.zIndex();
            }
            setFile(res);
          });
        }
      };

      // 绑定运行时
      const runtime = new ArcadeRuntime(stage, updateTarget, false);
      runtime.handleKeyDown = runtime.handleKeyDown.bind(runtime);
      runtime.handleKeyUp = runtime.handleKeyUp.bind(runtime);
      document.addEventListener('keydown', runtime.handleKeyDown);
      document.addEventListener('keyup', runtime.handleKeyUp);
      onRuntime(runtime);

      return () => {
        document.removeEventListener('keydown', runtime.handleKeyDown);
        document.removeEventListener('keyup', runtime.handleKeyUp);
        onRuntime(null);
      };
    },
    [onRuntime],
  );

  return (
    <Emulator
      id="arcade-emulator"
      zoom={appState.value?.stageSize !== StageConfig.Large ? 1 : 1.5}
      width={StageConfig.Width}
      height={StageConfig.Height}
      onRuntime={handleRuntime}
    />
  );
}
