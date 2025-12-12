import './l10n';

import { html2canvas } from '@blockcode/utils';
import { ScratchBlocks, blocksTab, codeReviewTab } from '@blockcode/blocks';
import { paintTab } from '@blockcode/paint';
import { soundTab } from '@blockcode/sound';

import { Text } from '@blockcode/core';
import { CodeReview } from '@blockcode/blocks';
import { ArcadeBlocksEditor } from './components/blocks-editor/blocks-editor';
import { ImportSection } from './components/file-menu/import-section';
import { SettingsSection } from './components/edit-menu/settings-section';
import { DeviceMenu } from './components/device-menu/device-menu';
import { Sidedock } from './components/sidedock/sidedock';
import { PaintTabLabel } from './components/tabs/paint-tab-label';
import { PaintTabContent } from './components/tabs/paint-tab-content';
import { SoundTabContent } from './components/tabs/sound-tab-content';

import { createDefaultProject } from './lib/default-project';

import deviceIcon from './components/device-menu/icon-device.svg';

export default {
  onNew() {
    return createDefaultProject();
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
    // 不储存扩展文件，每次都会用新的扩展
    assets = assets.filter((asset) => !asset.id.startsWith('ext/'));
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
      workspace?.undo(false);
    }
  },

  onRedo(e) {
    if (e instanceof MouseEvent) {
      const workspace = ScratchBlocks.getMainWorkspace();
      workspace?.undo(true);
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
      id: 'edit',
      Menu: SettingsSection,
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
    DEBUG && {
      ...codeReviewTab,
    },
    DEBUG && {
      ...codeReviewTab,
      Content: () => <CodeReview keyName="script" />,
    },
  ].filter(Boolean),

  docks: [
    {
      expand: 'right',
      Content: Sidedock,
    },
  ],
};
