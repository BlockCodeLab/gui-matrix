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
          shadow: 'sound_sounds_menu',
        },
      },
      emu(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        const soundCode = this.valueToCode(block, 'SOUND_MENU', this.ORDER_NONE) || '""';
        code += `runtime.playWave(${soundCode});\n`;
        return code;
      },
    },
    {
      // 播放声音直到停止
      id: 'playuntildone',
      text: ScratchBlocks.Msg.SOUND_PLAYUNTILDONE,
      inputs: {
        SOUND_MENU: {
          shadow: 'sound_sounds_menu',
        },
      },
      emu(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        const soundCode = this.valueToCode(block, 'SOUND_MENU', this.ORDER_NONE) || '""';
        code += `await runtime.playWave(${soundCode});\n`;
        return code;
      },
    },
    {
      // 停止全部声音
      id: 'stopallsounds',
      text: ScratchBlocks.Msg.SOUND_STOPALLSOUNDS,
      emu(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        code += 'runtime.stopAllWaves();\n';
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
  ],
});
