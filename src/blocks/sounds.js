import { themeColors } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';

export default () => ({
  id: 'sound',
  name: '%{BKY_CATEGORY_SOUND}',
  themeColor: themeColors.blocks.sounds.primary,
  inputColor: themeColors.blocks.sounds.secondary,
  otherColor: themeColors.blocks.sounds.tertiary,
  order: 2,
  blocks: [
    {
      // 播放声音直到停止
      id: 'playuntildone',
      text: ScratchBlocks.Msg.SOUND_PLAYUNTILDONE,
      inputs: {
        SOUND_MENU: {
          shadowType: 'sound_sounds_menu',
        },
      },
      emu(block) {
        const soundCode = this.valueToCode(block, 'SOUND_MENU', this.ORDER_NONE) || '""';
        const code = `await runtime.playWave(${soundCode});\n`;
        this.renderLoopTrap();
        return code;
      },
    },
    {
      // 播放声音
      id: 'play',
      text: ScratchBlocks.Msg.SOUND_PLAY,
      inputs: {
        SOUND_MENU: {
          shadowType: 'sound_sounds_menu',
        },
      },
      emu(block) {
        const soundCode = this.valueToCode(block, 'SOUND_MENU', this.ORDER_NONE) || '""';
        const code = `runtime.playWave(${soundCode});\n`;
        this.renderLoopTrap();
        return code;
      },
    },
    {
      // 停止全部声音
      id: 'stopallsounds',
      text: ScratchBlocks.Msg.SOUND_STOPALLSOUNDS,
      emu(block) {
        const code = 'runtime.stopAllWaves();\n';
        return code;
      },
    },
    {
      // 声音菜单
      id: 'sounds_menu',
      emu(block) {
        const code = this.quote_(block.getFieldValue('SOUND_MENU') || '');
        return [code, this.ORDER_ATOMIC];
      },
    },
    '---',
    {
      // 增加声音
      id: 'changevolumeby',
      text: ScratchBlocks.Msg.SOUND_CHANGEVOLUMEBY,
      inputs: {
        VOLUME: {
          type: 'integer',
          defaultValue: 10,
        },
      },
      emu(block) {
        const volume = this.valueToCode(block, 'VOLUME', this.ORDER_NONE);
        const code = `runtime.waveVolume += ${volume};\n`;
        return code;
      },
    },
    {
      // 设置声音
      id: 'setvolumeto',
      text: ScratchBlocks.Msg.SOUND_SETVOLUMETO,
      inputs: {
        VOLUME: {
          type: 'positive_integer',
          defaultValue: 100,
        },
      },
      emu(block) {
        const volume = this.valueToCode(block, 'VOLUME', this.ORDER_NONE);
        const code = `runtime.waveVolume = ${volume};\n`;
        return code;
      },
    },
    {
      id: 'volume',
      text: ScratchBlocks.Msg.SOUND_VOLUME,
      output: 'number',
      monitoring: true,
      emu(block) {
        const code = `runtime.waveVolume`;
        return [code, this.ORDER_ATOMIC];
      },
    },
    '---',
    {
      // 增加声音
      id: 'changevolumeby',
      text: ScratchBlocks.Msg.SOUND_CHANGEVOLUMEBY,
      inputs: {
        VOLUME: {
          type: 'integer',
          defaultValue: 10,
        },
      },
      emu(block) {
        const volume = this.valueToCode(block, 'VOLUME', this.ORDER_NONE);
        const code = `runtime.waveVolume += ${volume};\n`;
        return code;
      },
    },
    {
      // 设置声音
      id: 'setvolumeto',
      text: ScratchBlocks.Msg.SOUND_SETVOLUMETO,
      inputs: {
        VOLUME: {
          type: 'positive_integer',
          defaultValue: 100,
        },
      },
      emu(block) {
        const volume = this.valueToCode(block, 'VOLUME', this.ORDER_NONE);
        const code = `runtime.waveVolume = ${volume};\n`;
        return code;
      },
    },
    {
      id: 'volume',
      text: ScratchBlocks.Msg.SOUND_VOLUME,
      output: 'number',
      monitoring: true,
      emu(block) {
        const code = `runtime.waveVolume`;
        return [code, this.ORDER_ATOMIC];
      },
    },
  ],
});
