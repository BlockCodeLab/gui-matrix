import './l10n';

import { html2canvas } from '@blockcode/utils';
import { ScratchBlocks, blocksTab, codeReviewTab } from '@blockcode/blocks';
import { paintTab } from '@blockcode/paint';
import { soundTab } from '@blockcode/sound';

import { CodeReview } from '@blockcode/blocks';
import { MatrixBlocksEditor } from './components/blocks-editor/blocks-editor';
import { Sidedock } from './components/sidedock/sidedock';
import { PaintTabLabel } from './components/tabs/paint-tab-label';
import { PaintTabContent } from './components/tabs/paint-tab-content';
import { SoundTabContent } from './components/tabs/sound-tab-content';

import { defaultProject } from './lib/default-project';

export default {
  onNew() {
    return defaultProject;
  },

  onSave(files, assets) {
    const extensions = [];
    files = files.map((file, index) => {
      extensions.push(file.extensions);
      // 舞台
      if (index === 0) {
        return {
          id: file.id,
          name: file.name,
          type: file.type,
          xml: file.xml,
          assets: file.assets,
          frame: file.frame,
        };
      }
      // 角色
      return {
        id: file.id,
        name: file.name,
        type: file.type,
        xml: file.xml,
        assets: file.assets,
        frame: file.frame,
        x: file.x,
        y: file.y,
        size: file.size,
        direction: file.direction,
        rotationStyle: file.rotationStyle,
        hidden: file.hidden,
        zIndex: file.zIndex,
      };
    });
    const meta = {
      extensions: Array.from(new Set(extensions.flat())),
    };
    return {
      meta,
      files,
      assets,
      fileId: files[1].id,
    };
  },

  async onThumb() {
    const content = document.querySelector('#matrix-emulator > .konvajs-content');
    const canvas = await html2canvas(content);
    return canvas?.toDataURL();
  },

  onUndo(e) {
    if (e instanceof MouseEvent) {
      const workspace = ScratchBlocks.getMainWorkspace();
      workspace?.undo?.(false);
    }
  },

  onRedo(e) {
    if (e instanceof MouseEvent) {
      const workspace = ScratchBlocks.getMainWorkspace();
      workspace?.undo?.(true);
    }
  },

  onEnableUndo() {
    const workspace = ScratchBlocks.getMainWorkspace();
    return workspace?.undoStack_ && workspace.undoStack_.length !== 0;
  },

  onEnableRedo() {
    const workspace = ScratchBlocks.getMainWorkspace();
    return workspace?.redoStack_ && workspace.redoStack_.length !== 0;
  },

  menuItems: [
    {
      id: 'file',
    },
  ],

  tabs: [
    {
      ...blocksTab,
      Content: MatrixBlocksEditor,
    },
    {
      ...paintTab,
      label: <PaintTabLabel />,
      Content: PaintTabContent,
    },
    {
      ...soundTab,
      Content: SoundTabContent,
    },
  ].concat(
    DEBUG
      ? {
          ...codeReviewTab,
          Content: CodeReview,
        }
      : [],
  ),

  docks: [
    {
      expand: 'right',
      Content: Sidedock,
    },
  ],
};
