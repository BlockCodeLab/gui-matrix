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
        return code;
      },
      mpy(block) {
        const soundCode = this.valueToCode(block, 'SOUND_MENU', this.ORDER_NONE) || '';
        const code = `runtime.play_sound(__file__, ${soundCode})\n`;
        return code;
      },
    },
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
        return code;
      },
      mpy(block) {
        const soundCode = this.valueToCode(block, 'SOUND_MENU', this.ORDER_NONE) || '';
        const code = `await runtime.play_sound_wait(__file__, ${soundCode})\n`;
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
      mpy(block) {
        const code = `runtime.stop_sound()\n`;
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
      mpy(block) {
        const code = this.quote_(block.getFieldValue('SOUND_MENU') || '');
        return [code, this.ORDER_ATOMIC];
      },
    },
  ],
});
