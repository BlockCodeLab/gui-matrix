import { maybeTranslate, translate, addAsset, openTab } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';
import { defaultSound } from '../lib/default-sound';

import getMotionBlocks from './motion';
import getLooksBlocks from './looks';
import getSoundBlocks from './sounds';
import getEventBlocks from './events';
import getControlBlocks from './control';
import getSensingBlocks from './sensing';
import getDataBlocks from './data';
import getMyBlocks from './procedures';

export { MatrixEmulatorGenerator } from './generator';

// 积木声音菜单开始录音
const recordSound = () => {
  addAsset({
    ...defaultSound,
    name: maybeTranslate(defaultSound.name),
  });
  openTab(2);
};

export function buildBlocks(assets, files, sprite) {
  const stage = files[0];
  const isStage = stage.id === sprite.id;
  const otherSprites = files.filter((file) => file.id !== stage.id && file.id !== sprite.id);

  const soundsMenu = assets.filter((asset) => asset.type.startsWith('audio/')).map((sound) => [sound.name, sound.id]);

  const otherSpritesMenu = otherSprites.map((sprite) => [sprite.name, sprite.id]);

  const costumesMenu = sprite.assets.map((assetId) => {
    const costume = assets.find((asset) => assetId === asset.id);
    return [costume?.name ?? assetId, assetId];
  });

  const backdropsMenu = stage.assets.map((assetId) => {
    const backdrop = assets.find((asset) => assetId === asset.id);
    return [backdrop?.name ?? assetId, assetId];
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

  const controlBlocks = getControlBlocks();
  const dataBlocks = getDataBlocks();
  const myBlocks = getMyBlocks();

  const eventBlocks = getEventBlocks();
  eventBlocks.blocks.find((block) => block.id === 'whenbackdropswitchesto').inputs.BACKDROP.menu = backdropsMenu;

  const soundBlocks = getSoundBlocks();
  soundBlocks.blocks.forEach((block) => {
    if (['play', 'playuntildone'].includes(block.id)) {
      block.inputs.SOUND_MENU.defaultValue = soundsMenu[0]?.[1] ?? '';
    }
  });

  const motionBlocks = getMotionBlocks();

  const looksBlocks = getLooksBlocks();
  looksBlocks.blocks.forEach((block) => {
    if (block.id === 'switchcostumeto') {
      block.inputs.COSTUME.defaultValue = costumesMenu[0]?.[1] ?? '';
      return;
    }
    if (['switchbackdropto', 'switchbackdroptoandwait'].includes(block.id)) {
      block.inputs.BACKDROP.defaultValue = backdropsMenu[0]?.[1] ?? '';
    }
  });

  const sensingBlocks = getSensingBlocks();
  sensingBlocks.blocks = sensingBlocks.blocks.filter((block) => {
    if (block.id === 'of') {
      return files.length > 1;
    }
    return true;
  });
  const sensingOfBlock = sensingBlocks.blocks.find((block) => block.id === 'of');
  if (sensingOfBlock) {
    sensingOfBlock.inputs.PROPERTY.menu = isStage ? spritePropertyMenu : stagePropertyMenu;
    sensingOfBlock.inputs.OBJECT.defaultValue = otherSpritesMenu[0]?.[1] ?? '';
    if (!isStage) {
      sensingOfBlock.inputs.OBJECT.defaultValue = '_stage_';
    }
    sensingOfBlock.onInit = function () {
      const object = this.getInput('OBJECT');
      const property = this.getField('PROPERTY');
      setTimeout(() => {
        const target = object.connection.targetBlock();
        if (!target) return;
        const targetValue = target.getFieldValue('OBJECT');
        property.menuGenerator_ = targetValue === '_stage_' ? stagePropertyMenu : spritePropertyMenu;
        const propValue = property.getValue();
        property.menuGenerator_.forEach((prop) => {
          if (prop[1] === propValue) {
            property.setText(prop[0]);
          }
        });
      });
    };
    sensingOfBlock.onChange = function (e) {
      if (this.type === 'sensing_of' && e.name === 'OBJECT') {
        const property = this.getField('PROPERTY');
        property.menuGenerator_ = e.newValue === '_stage_' ? stagePropertyMenu : spritePropertyMenu;
        property.setText(property.menuGenerator_[0][0]);
        property.setValue(property.menuGenerator_[0][1]);
      }
    };
  }

  // 动态更新菜单项内容
  //
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
  ScratchBlocks.Blocks['control_create_clone_of_menu'] = {
    init() {
      let options = [...otherSpritesMenu];
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
            options: [
              [ScratchBlocks.Msg.SENSING_TOUCHINGOBJECT_POINTER, '_mouse_'],
              [ScratchBlocks.Msg.SENSING_TOUCHINGOBJECT_EDGE, '_edge_'],
              ...otherSpritesMenu,
            ],
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
            options: [[ScratchBlocks.Msg.SENSING_TOUCHINGOBJECT_POINTER, '_mouse_'], ...otherSpritesMenu],
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

  return [motionBlocks, looksBlocks, soundBlocks, eventBlocks, controlBlocks, sensingBlocks, dataBlocks, myBlocks];
}
