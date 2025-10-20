import { themeColors, Text } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';

export default () => ({
  id: 'looks',
  name: '%{BKY_CATEGORY_LOOKS}',
  themeColor: themeColors.blocks.looks.primary,
  inputColor: themeColors.blocks.looks.secondary,
  otherColor: themeColors.blocks.looks.tertiary,
  order: 1,
  blocks: [
    {
      // 说2秒
      id: 'sayforsecs',
      text: (
        <Text
          id="matrix.blocks.textBubbleAndWait"
          defaultMessage="%1 %2 for %3 seconds"
        />
      ),
      forStage: false,
      inputs: {
        OPTION: {
          menu: 'sayOptions',
        },
        MESSAGE: {
          type: 'string',
          defaultValue: ScratchBlocks.Msg.LOOKS_HELLO,
        },
        SECS: {
          type: 'number',
          defaultValue: 2,
        },
      },
      emu(block) {
        const optionValue = block.getFieldValue('OPTION') || 'say';
        const msgCode = this.valueToCode(block, 'MESSAGE', this.ORDER_NONE) || '""';
        const secCode = this.valueToCode(block, 'SECS', this.ORDER_NONE) || '2';

        const code = `await targetUtils.say(userscript, ${msgCode}, ${secCode}, ${optionValue === 'shout'});\n`;
        return code;
      },
    },
    {
      // 说
      id: 'say',
      text: (
        <Text
          id="matrix.blocks.textBubble"
          defaultMessage="%1 %2"
        />
      ),
      forStage: false,
      inputs: {
        OPTION: {
          menu: 'sayOptions',
        },
        MESSAGE: {
          type: 'string',
          defaultValue: ScratchBlocks.Msg.LOOKS_HELLO,
        },
      },
      emu(block) {
        const optionValue = block.getFieldValue('OPTION') || 'say';
        const msgCode = this.valueToCode(block, 'MESSAGE', this.ORDER_NONE) || '""';
        const code = `targetUtils.say(userscript, ${msgCode}, false, ${optionValue === 'shout'});\n`;
        this.renderLoopTrap();
        return code;
      },
    },
    {
      // 思考2秒
      id: 'thinkforsecs',
      text: (
        <Text
          id="matrix.blocks.textBubbleAndWait"
          defaultMessage="%1 %2 for %3 seconds"
        />
      ),
      forStage: false,
      inputs: {
        OPTION: {
          menu: 'thinkOptions',
        },
        MESSAGE: {
          type: 'string',
          defaultValue: ScratchBlocks.Msg.LOOKS_HMM,
        },
        SECS: {
          type: 'number',
          defaultValue: 2,
        },
      },
      emu(block) {
        const optionValue = block.getFieldValue('OPTION') || 'think';
        const msgCode = this.valueToCode(block, 'MESSAGE', this.ORDER_NONE) || '""';
        const secCode = this.valueToCode(block, 'SECS', this.ORDER_NONE) || '2';

        const code = `await targetUtils.think(userscript, ${msgCode}, ${secCode}, ${optionValue === 'spark'});\n`;
        return code;
      },
    },
    {
      // 思考
      id: 'think',
      text: (
        <Text
          id="matrix.blocks.textBubble"
          defaultMessage="%1 %2"
        />
      ),
      forStage: false,
      inputs: {
        OPTION: {
          menu: 'thinkOptions',
        },
        MESSAGE: {
          type: 'string',
          defaultValue: ScratchBlocks.Msg.LOOKS_HMM,
        },
      },
      emu(block) {
        const optionValue = block.getFieldValue('OPTION') || 'think';
        const msgCode = this.valueToCode(block, 'MESSAGE', this.ORDER_NONE) || '""';
        const code = `targetUtils.think(userscript, ${msgCode}, false, ${optionValue === 'spark'});\n`;
        this.renderLoopTrap();
        return code;
      },
    },
    '---',
    {
      // 换造型
      id: 'switchcostumeto',
      text: ScratchBlocks.Msg.LOOKS_SWITCHCOSTUMETO,
      forStage: false,
      inputs: {
        COSTUME: {
          shadowType: 'looks_costume',
        },
      },
      emu(block) {
        const costumeCode = this.valueToCode(block, 'COSTUME', this.ORDER_NONE) || '1';
        const code = `targetUtils.switchFrameTo(userscript, ${costumeCode});\n`;
        this.renderLoopTrap();
        return code;
      },
    },
    {
      // 下一个造型
      id: 'nextcostume',
      text: ScratchBlocks.Msg.LOOKS_NEXTCOSTUME,
      forStage: false,
      emu(block) {
        const code = 'targetUtils.nextFrame(userscript);\n';
        this.renderLoopTrap();
        return code;
      },
    },
    {
      // 换背景
      id: 'switchbackdropto',
      text: ScratchBlocks.Msg.LOOKS_SWITCHBACKDROPTO,
      inputs: {
        BACKDROP: {
          shadowType: 'looks_backdrops',
        },
      },
      emu(block) {
        const backdropCode = this.valueToCode(block, 'BACKDROP', this.ORDER_NONE) || '1';
        const code = `targetUtils.switchFrameTo(stage, ${backdropCode}, true);\n`;
        this.renderLoopTrap();
        return code;
      },
    },
    {
      // 换背景等待
      id: 'switchbackdroptoandwait',
      text: ScratchBlocks.Msg.LOOKS_SWITCHBACKDROPTOANDWAIT,
      forSprite: false,
      inputs: {
        BACKDROP: {
          shadowType: 'looks_backdrops',
        },
      },
      emu(block) {
        const backdropCode = this.valueToCode(block, 'BACKDROP', this.ORDER_NONE) || '1';
        const code = `await targetUtils.switchFrameTo(stage, ${backdropCode}, true);\n`;
        return code;
      },
    },
    {
      // 下一个背景
      id: 'nextbackdrop',
      text: ScratchBlocks.Msg.LOOKS_NEXTBACKDROP_BLOCK,
      emu(block) {
        const code = 'targetUtils.nextFrame(stage, true);\n';
        this.renderLoopTrap();
        return code;
      },
    },
    '---',
    {
      // 增加尺寸
      id: 'changesizeby',
      text: ScratchBlocks.Msg.LOOKS_CHANGESIZEBY,
      forStage: false,
      inputs: {
        CHANGE: {
          type: 'number',
          defaultValue: 10,
        },
      },
      emu(block) {
        const changeCode = this.valueToCode(block, 'CHANGE', this.ORDER_NONE) || 10;
        const code = `targetUtils.addSize(userscript, ${changeCode});\n`;
        this.renderLoopTrap();
        return code;
      },
    },
    {
      // 设置尺寸
      id: 'setsizeto',
      text: ScratchBlocks.Msg.LOOKS_SETSIZETO,
      forStage: false,
      inputs: {
        SIZE: {
          type: 'number',
          defaultValue: 100,
        },
      },
      emu(block) {
        const sizeCode = this.valueToCode(block, 'SIZE', this.ORDER_NONE) || 100;
        const code = `targetUtils.setSize(userscript, ${sizeCode});\n`;
        this.renderLoopTrap();
        return code;
      },
    },
    '---',
    {
      // 特效增加
      id: 'changeeffectby',
      text: ScratchBlocks.Msg.LOOKS_CHANGEEFFECTBY,
      inputs: {
        EFFECT: {
          menu: 'effectOptions',
        },
        CHANGE: {
          type: 'integer',
          defaultValue: 25,
        },
      },
      emu(block) {
        const effectCode = this.quote_(block.getFieldValue('EFFECT'));
        const changeCode = this.valueToCode(block, 'CHANGE', this.ORDER_NONE) || 25;
        const code = `targetUtils.addEffect(userscript, ${effectCode}, ${changeCode});\n`;
        this.renderLoopTrap();
        return code;
      },
    },
    {
      // 特效设为
      id: 'seteffectto',
      text: ScratchBlocks.Msg.LOOKS_SETEFFECTTO,
      inputs: {
        EFFECT: {
          menu: 'effectOptions',
        },
        VALUE: {
          type: 'integer',
          defaultValue: 0,
        },
      },
      emu(block) {
        const effectCode = this.quote_(block.getFieldValue('EFFECT'));
        const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || 0;
        const code = `targetUtils.setEffect(userscript, ${effectCode}, ${valueCode});\n`;
        this.renderLoopTrap();
        return code;
      },
    },
    {
      // 清除特效
      id: 'cleargraphiceffects',
      text: ScratchBlocks.Msg.LOOKS_CLEARGRAPHICEFFECTS,
      emu(block) {
        const code = 'targetUtils.clearEffect(userscript);\n';
        this.renderLoopTrap();
        return code;
      },
    },
    '---',
    {
      // 显示
      id: 'show',
      text: ScratchBlocks.Msg.LOOKS_SHOW,
      forStage: false,
      emu(block) {
        const code = 'target.visible(true);\n';
        this.renderLoopTrap();
        return code;
      },
    },
    {
      // 隐藏
      id: 'hide',
      text: ScratchBlocks.Msg.LOOKS_HIDE,
      forStage: false,
      emu(block) {
        const code = 'target.visible(false);\n';
        this.renderLoopTrap();
        return code;
      },
    },
    '---',
    {
      // 顶或底层
      id: 'gotofrontback',
      text: ScratchBlocks.Msg.LOOKS_GOTOFRONTBACK,
      forStage: false,
      inputs: {
        FRONT_BACK: {
          type: 'string',
          menu: [
            [ScratchBlocks.Msg.LOOKS_GOTOFRONTBACK_FRONT, 'front'],
            [ScratchBlocks.Msg.LOOKS_GOTOFRONTBACK_BACK, 'back'],
          ],
        },
      },
      emu(block) {
        const frontOrBackValue = block.getFieldValue('FRONT_BACK');

        let code = '';
        if (frontOrBackValue === 'back') {
          code += 'target.moveToBottom();\n';
        } else {
          code += 'target.moveToTop();\n';
        }
        this.renderLoopTrap();
        return code;
      },
    },
    {
      // 移动层
      id: 'goforwardbackwardlayers',
      text: ScratchBlocks.Msg.LOOKS_GOFORWARDBACKWARDLAYERS,
      forStage: false,
      inputs: {
        FORWARD_BACKWARD: {
          type: 'string',
          menu: [
            [ScratchBlocks.Msg.LOOKS_GOFORWARDBACKWARDLAYERS_FORWARD, 'forward'],
            [ScratchBlocks.Msg.LOOKS_GOFORWARDBACKWARDLAYERS_BACKWARD, 'backward'],
          ],
        },
        NUM: {
          type: 'number',
          defaultValue: 1,
        },
      },
      emu(block) {
        const forwardOrBackwardValue = block.getFieldValue('FORWARD_BACKWARD');
        const changeCode = this.valueToCode(block, 'NUM', this.ORDER_NONE) || 1;

        let code = '';
        if (forwardOrBackwardValue === 'backward') {
          code += `targetUtils.backward(userscript, ${changeCode});\n`;
        } else {
          code += `targetUtils.forward(userscript, ${changeCode});\n`;
        }
        this.renderLoopTrap();
        return code;
      },
    },
    '---',
    {
      // 造型
      id: 'costumenumbername',
      text: ScratchBlocks.Msg.LOOKS_COSTUMENUMBERNAME,
      forStage: false,
      output: 'string',
      inputs: {
        NUMBER_NAME: {
          type: 'string',
          menu: [
            [ScratchBlocks.Msg.LOOKS_NUMBERNAME_NUMBER, 'number'],
            [ScratchBlocks.Msg.LOOKS_NUMBERNAME_NAME, 'name'],
          ],
        },
      },
      emu(block) {
        const numberOrNameValue = this.quote_(block.getFieldValue('NUMBER_NAME'));
        const code = `targetUtils.getFrameSerialOrName(userscript, ${numberOrNameValue})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // 背景
      id: 'backdropnumbername',
      text: ScratchBlocks.Msg.LOOKS_BACKDROPNUMBERNAME,
      output: 'string',
      inputs: {
        NUMBER_NAME: {
          type: 'string',
          menu: [
            [ScratchBlocks.Msg.LOOKS_NUMBERNAME_NUMBER, 'number'],
            [ScratchBlocks.Msg.LOOKS_NUMBERNAME_NAME, 'name'],
          ],
        },
      },
      emu(block) {
        const numberOrNameValue = this.quote_(block.getFieldValue('NUMBER_NAME'));
        const code = `targetUtils.getFrameSerialOrName(stage, ${numberOrNameValue})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // 尺寸
      id: 'size',
      text: ScratchBlocks.Msg.LOOKS_SIZE,
      forStage: false,
      output: 'number',
      monitoring: true,
      emu(block) {
        return [`target.getAttr('scaleSize')`, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // 造型菜单
      id: 'costume',
      emu(block) {
        const code = this.quote_(block.getFieldValue('COSTUME'));
        return [code, this.ORDER_ATOMIC];
      },
    },
    {
      // 背景菜单
      id: 'backdrops',
      emu(block) {
        const code = this.quote_(block.getFieldValue('BACKDROP'));
        return [code, this.ORDER_ATOMIC];
      },
    },
  ],
  menus: {
    sayOptions: {
      type: 'string',
      items: [
        [
          <Text
            id="matrix.blocks.say"
            defaultMessage="say"
          />,
          'say',
        ],
        [
          <Text
            id="matrix.blocks.shout"
            defaultMessage="shout"
          />,
          'shout',
        ],
      ],
    },
    thinkOptions: {
      type: 'string',
      items: [
        [
          <Text
            id="matrix.blocks.think"
            defaultMessage="think"
          />,
          'think',
        ],
        [
          <Text
            id="matrix.blocks.spark"
            defaultMessage="spark"
          />,
          'spark',
        ],
      ],
    },
    effectOptions: {
      type: 'string',
      items: [
        // [ScratchBlocks.Msg.LOOKS_EFFECT_COLOR, 'COLOR'],
        // [ScratchBlocks.Msg.LOOKS_EFFECT_FISHEYE, 'FISHEYE'],
        // [ScratchBlocks.Msg.LOOKS_EFFECT_WHIRL, 'WHIRL'],
        // [ScratchBlocks.Msg.LOOKS_EFFECT_PIXELATE, 'PIXELATE'],
        // [ScratchBlocks.Msg.LOOKS_EFFECT_MOSAIC, 'MOSAIC'],
        // [ScratchBlocks.Msg.LOOKS_EFFECT_BRIGHTNESS, 'BRIGHTNESS'],
        [ScratchBlocks.Msg.LOOKS_EFFECT_GHOST, 'GHOST'],
      ],
    },
  },
});
