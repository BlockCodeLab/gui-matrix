import { ScratchBlocks } from '@blockcode/blocks-editor';

import './event';
import './sensing';
import './sound';
import './wifi';
import './unsupported';

export default function (assetList, fileList, selectedFileId, maybeLocaleText, recordSound) {
  const stage = fileList[0];
  const sprite = fileList.find((file) => file.id === selectedFileId);
  const otherSprites = fileList.filter((file, i) => i > 0 && file.id !== selectedFileId);
  const isStage = stage === sprite;

  const otherSpritesMenu = otherSprites.map((sprite) => [maybeLocaleText(sprite.name), sprite.id]);

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
        colour: ScratchBlocks.Colours.motion.secondary,
        colourSecondary: ScratchBlocks.Colours.motion.secondary,
        colourTertiary: ScratchBlocks.Colours.motion.tertiary,
        colourQuaternary: ScratchBlocks.Colours.motion.quaternary,
        extensions: ['output_string'],
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
        colour: ScratchBlocks.Colours.motion.secondary,
        colourSecondary: ScratchBlocks.Colours.motion.secondary,
        colourTertiary: ScratchBlocks.Colours.motion.tertiary,
        colourQuaternary: ScratchBlocks.Colours.motion.quaternary,
        extensions: ['output_string'],
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
        colour: ScratchBlocks.Colours.motion.secondary,
        colourSecondary: ScratchBlocks.Colours.motion.secondary,
        colourTertiary: ScratchBlocks.Colours.motion.tertiary,
        colourQuaternary: ScratchBlocks.Colours.motion.quaternary,
        extensions: ['output_string'],
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
            options: sprite.assets.map((assetId) => {
              const asset = assetList.find(({ id }) => assetId === id);
              return [maybeLocaleText(asset.name), assetId];
            }),
          },
        ],
        colour: ScratchBlocks.Colours.looks.secondary,
        colourSecondary: ScratchBlocks.Colours.looks.secondary,
        colourTertiary: ScratchBlocks.Colours.looks.tertiary,
        colourQuaternary: ScratchBlocks.Colours.looks.quaternary,
        extensions: ['output_string'],
      });
    },
  };

  const stageMenu = stage.assets.map((assetId) => {
    const asset = assetList.find(({ id }) => assetId === id);
    return [maybeLocaleText(asset.name), assetId];
  });

  ScratchBlocks.Blocks['looks_backdrops'] = {
    init() {
      this.jsonInit({
        message0: '%1',
        args0: [
          {
            type: 'field_dropdown',
            name: 'BACKDROP',
            options: stageMenu,
          },
        ],
        colour: ScratchBlocks.Colours.looks.secondary,
        colourSecondary: ScratchBlocks.Colours.looks.secondary,
        colourTertiary: ScratchBlocks.Colours.looks.tertiary,
        colourQuaternary: ScratchBlocks.Colours.looks.quaternary,
        extensions: ['output_string'],
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
            options: stageMenu,
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
            options: [
              ...assetList
                .filter((asset) => asset.type === 'audio/wav')
                .map((sound) => [maybeLocaleText(sound.name), sound.id]),
              [ScratchBlocks.Msg.SOUND_RECORD, recordSound],
            ],
          },
        ],
        colour: ScratchBlocks.Colours.sounds.secondary,
        colourSecondary: ScratchBlocks.Colours.sounds.secondary,
        colourTertiary: ScratchBlocks.Colours.sounds.tertiary,
        colourQuaternary: ScratchBlocks.Colours.sounds.quaternary,
        extensions: ['output_string'],
      });
    },
  };
}
