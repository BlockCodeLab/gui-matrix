import { maybeTranslate, addAsset, openTab } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';
import { defaultSound } from '../lib/default-sound';

import './events';
import './looks';
import './sensing';
import './sound';
import './unsupported';
import './wifi';

// 积木声音菜单开始录音
const recordSound = () => {
  addAsset({
    ...defaultSound,
    id: nanoid,
  });
  openTab(2);
};

export function buildBlocks(assets, files, fileId, translator) {
  const stage = files[0];
  const isStage = stage.id === fileId;
  const sprite = files.find((file) => file.id === fileId);
  const otherSprites = files.filter((file, i) => i > 0 && file.id !== fileId);

  const otherSpritesMenu = otherSprites.map((sprite) => [maybeTranslate(sprite.name, translator), sprite.id]);

  const costumesMenu = sprite.assets.map((assetId) => {
    const costume = assets.find((asset) => assetId === asset.id);
    return [maybeTranslate(costume?.name ?? assetId, translator), assetId];
  });

  const backdropsMenu = stage.assets.map((assetId) => {
    const backdrop = assets.find((asset) => assetId === asset.id);
    return [maybeTranslate(backdrop?.name ?? assetId, translator), assetId];
  });

  const stagePropertyMenu = [
    [ScratchBlocks.Msg.SENSING_OF_BACKDROPNUMBER, 'backdrop #'],
    [ScratchBlocks.Msg.SENSING_OF_BACKDROPNAME, 'backdrop name'],
    // [ScratchBlocks.Msg.SENSING_OF_VOLUME, 'volume']
  ];

  const spritePropertyMenu = [
    [ScratchBlocks.Msg.SENSING_OF_XPOSITION, 'x position'],
    [ScratchBlocks.Msg.SENSING_OF_YPOSITION, 'y position'],
    [ScratchBlocks.Msg.SENSING_OF_DIRECTION, 'direction'],
    [ScratchBlocks.Msg.SENSING_OF_COSTUMENUMBER, 'costume #'],
    [ScratchBlocks.Msg.SENSING_OF_COSTUMENAME, 'costume name'],
    [ScratchBlocks.Msg.SENSING_OF_SIZE, 'size'],
    // [ScratchBlocks.Msg.SENSING_OF_VOLUME, 'volume']
  ];

  const soundsMenu = assets
    .filter((asset) => asset.type.startsWith('audio/'))
    .map((sound) => [maybeTranslate(sound.name, translator), sound.id]);

  ScratchBlocks.Blocks['motion_pointtowards_menu'] = {
    init() {
      this.jsonInit({
        message0: '%1',
        args0: [
          {
            type: 'field_dropdown',
            name: 'TOWARDS',
            options: [[ScratchBlocks.Msg.MOTION_POINTTOWARDS_RANDOM, '_random_'], ...otherSpritesMenu],
          },
        ],
        category: ScratchBlocks.Categories.motion,
        extensions: ['colours_motion', 'output_string'],
      });
    },
  };

  ScratchBlocks.Blocks['motion_goto_menu'] = {
    init() {
      this.jsonInit({
        message0: '%1',
        args0: [
          {
            type: 'field_dropdown',
            name: 'TO',
            options: [[ScratchBlocks.Msg.MOTION_GOTO_RANDOM, '_random_'], ...otherSpritesMenu],
          },
        ],
        category: ScratchBlocks.Categories.motion,
        extensions: ['colours_motion', 'output_string'],
      });
    },
  };

  ScratchBlocks.Blocks['motion_glideto_menu'] = {
    init() {
      this.jsonInit({
        message0: '%1',
        args0: [
          {
            type: 'field_dropdown',
            name: 'TO',
            options: [[ScratchBlocks.Msg.MOTION_GLIDETO_RANDOM, '_random_'], ...otherSpritesMenu],
          },
        ],
        category: ScratchBlocks.Categories.motion,
        extensions: ['colours_motion', 'output_string'],
      });
    },
  };

  ScratchBlocks.Blocks['looks_costume'] = {
    init() {
      this.jsonInit({
        message0: '%1',
        args0: [
          {
            type: 'field_dropdown',
            name: 'COSTUME',
            options: costumesMenu,
          },
        ],
        category: ScratchBlocks.Categories.looks,
        extensions: ['colours_looks', 'output_string'],
      });
    },
  };

  ScratchBlocks.Blocks['looks_backdrops'] = {
    init() {
      this.jsonInit({
        message0: '%1',
        args0: [
          {
            type: 'field_dropdown',
            name: 'BACKDROP',
            options: backdropsMenu,
          },
        ],
        category: ScratchBlocks.Categories.looks,
        extensions: ['colours_looks', 'output_string'],
      });
    },
  };

  ScratchBlocks.Blocks['event_whenbackdropswitchesto'] = {
    init() {
      this.jsonInit({
        message0: ScratchBlocks.Msg.EVENT_WHENBACKDROPSWITCHESTO,
        args0: [
          {
            type: 'field_dropdown',
            name: 'BACKDROP',
            options: backdropsMenu,
          },
        ],
        category: ScratchBlocks.Categories.event,
        extensions: ['colours_event', 'shape_hat'],
      });
    },
  };

  ScratchBlocks.Blocks['control_create_clone_of_menu'] = {
    init() {
      const options = [...otherSpritesMenu];
      if (!isStage) {
        options.unshift([ScratchBlocks.Msg.CONTROL_CREATECLONEOF_MYSELF, '_myself_']);
      }
      if (options.length === 0) {
        options.push(['', '']);
      }
      this.jsonInit({
        message0: '%1',
        args0: [
          {
            type: 'field_dropdown',
            name: 'CLONE_OPTION',
            options,
          },
        ],
        category: ScratchBlocks.Categories.control,
        extensions: ['colours_control', 'output_string'],
      });
    },
  };

  ScratchBlocks.Blocks['sensing_touchingobjectmenu'] = {
    init() {
      this.jsonInit({
        message0: '%1',
        args0: [
          {
            type: 'field_dropdown',
            name: 'TOUCHINGOBJECTMENU',
            options: [[ScratchBlocks.Msg.SENSING_TOUCHINGOBJECT_EDGE, '_edge_'], ...otherSpritesMenu],
          },
        ],
        category: ScratchBlocks.Categories.sensing,
        extensions: ['colours_sensing', 'output_string'],
      });
    },
  };

  ScratchBlocks.Blocks['sensing_distancetomenu'] = {
    init() {
      this.jsonInit({
        message0: '%1',
        args0: [
          {
            type: 'field_dropdown',
            name: 'DISTANCETOMENU',
            options: [[ScratchBlocks.Msg.SENSING_OF_DISTANCETO_CENTER, '_center_'], ...otherSpritesMenu],
          },
        ],
        category: ScratchBlocks.Categories.sensing,
        extensions: ['colours_sensing', 'output_string'],
      });
    },
  };

  ScratchBlocks.Blocks['sensing_of_object_menu'] = {
    init() {
      const options = [...otherSpritesMenu];
      if (!isStage) {
        options.unshift([ScratchBlocks.Msg.SENSING_OF_STAGE, '_stage_']);
      }
      if (options.length === 0) {
        options.push(['', '']);
      }
      this.jsonInit({
        message0: '%1',
        args0: [
          {
            type: 'field_dropdown',
            name: 'OBJECT',
            options,
          },
        ],
        category: ScratchBlocks.Categories.sensing,
        extensions: ['colours_sensing', 'output_string'],
      });
    },
  };

  ScratchBlocks.Blocks['sensing_of'] = {
    init() {
      this.jsonInit({
        message0: ScratchBlocks.Msg.SENSING_OF,
        args0: [
          {
            type: 'field_dropdown',
            name: 'PROPERTY',
            options: isStage ? spritePropertyMenu : stagePropertyMenu,
          },
          {
            type: 'input_value',
            name: 'OBJECT',
          },
        ],
        output: true,
        category: ScratchBlocks.Categories.sensing,
        outputShape: ScratchBlocks.OUTPUT_SHAPE_ROUND,
        extensions: ['colours_sensing'],
      });
      const target = this.getInput('OBJECT');
      const property = this.getField('PROPERTY');
      setTimeout(() => {
        const block = target.connection.targetBlock();
        if (!block) return;
        const targetValue = block.getFieldValue('OBJECT');
        property.menuGenerator_ = targetValue === '_stage_' ? stagePropertyMenu : spritePropertyMenu;
        const propValue = property.getValue();
        property.menuGenerator_.forEach((prop) => {
          if (prop[1] === propValue) {
            property.setText(prop[0]);
          }
        });
      });
    },
    onchange(e) {
      if (this.type === 'sensing_of' && e.name === 'OBJECT') {
        const property = this.getField('PROPERTY');
        property.menuGenerator_ = e.newValue === '_stage_' ? stagePropertyMenu : spritePropertyMenu;
        property.setText(property.menuGenerator_[0][0]);
        property.setValue(property.menuGenerator_[0][1]);
      }
    },
  };

  ScratchBlocks.Blocks['sound_sounds_menu'] = {
    init() {
      this.jsonInit({
        message0: '%1',
        args0: [
          {
            type: 'field_dropdown',
            name: 'SOUND_MENU',
            options: [...soundsMenu, [ScratchBlocks.Msg.SOUND_RECORD, recordSound]],
          },
        ],
        category: ScratchBlocks.Categories.sound,
        extensions: ['colours_sounds', 'output_string'],
      });
    },
  };
}
