import './l10n';

import { html2canvas } from '@blockcode/utils';
import { ScratchBlocks, blocksTab, codeReviewTab } from '@blockcode/blocks';
import { paintTab } from '@blockcode/paint';
import { soundTab } from '@blockcode/sound';

import { Text } from '@blockcode/core';
import { CodeReview } from '@blockcode/blocks';
import { ArcadeBlocksEditor } from './components/blocks-editor/blocks-editor';
import { ImportSection } from './components/menu-items/import-section';
import { DeviceMenu } from './components/menu-items/device-menu';
import { Sidedock } from './components/sidedock/sidedock';
import { PaintTabLabel } from './components/tabs/paint-tab-label';
import { PaintTabContent } from './components/tabs/paint-tab-content';
import { SoundTabContent } from './components/tabs/sound-tab-content';

import { defaultProject } from './lib/default-project';

import deviceIcon from './components/menu-items/icon-device.svg';

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
    const content = document.querySelector('#arcade-emulator > .konvajs-content');
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
      Menu: ImportSection,
    },
    {
      icon: deviceIcon,
      label: (
        <Text
          id="arcade.menu.device"
          defaultMessage="Arcade"
        />
      ),
      Menu: DeviceMenu,
    },
  ],

  tabs: [
    {
      ...blocksTab,
      Content: ArcadeBlocksEditor,
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
