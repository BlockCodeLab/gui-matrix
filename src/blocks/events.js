import { themeColors, Text } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';

export default () => ({
  id: 'event',
  name: '%{BKY_CATEGORY_EVENTS}',
  themeColor: themeColors.blocks.events.primary,
  inputColor: themeColors.blocks.events.secondary,
  otherColor: themeColors.blocks.events.tertiary,
  blocks: [
    {
      // 点击绿旗
      id: 'whenflagclicked',
      text: ScratchBlocks.Msg.EVENT_WHENFLAGCLICKED,
      hat: true,
      inputs: {
        FLAG: {
          type: 'image',
          src: './assets/blocks-media/green-flag.svg',
        },
      },
      // 使用默认代码转换
    },
    {
      // 按键按下
      id: 'whenkeypressed',
      text: ScratchBlocks.Msg.EVENT_WHENKEYPRESSED,
      hat: true,
      inputs: {
        KEY_OPTION: {
          type: 'string',
          defaultValue: 'space',
          menu: [
            [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_SPACE, 'space'],
            [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_UP, 'up arrow'],
            [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_DOWN, 'down arrow'],
            [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_RIGHT, 'right arrow'],
            [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_LEFT, 'left arrow'],
            [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_ANY, 'any'],
            ['a', 'a'],
            ['b', 'b'],
            ['c', 'c'],
            ['d', 'd'],
            ['e', 'e'],
            ['f', 'f'],
            ['g', 'g'],
            ['h', 'h'],
            ['i', 'i'],
            ['j', 'j'],
            ['k', 'k'],
            ['l', 'l'],
            ['m', 'm'],
            ['n', 'n'],
            ['o', 'o'],
            ['p', 'p'],
            ['q', 'q'],
            ['r', 'r'],
            ['s', 's'],
            ['t', 't'],
            ['u', 'u'],
            ['v', 'v'],
            ['w', 'w'],
            ['x', 'x'],
            ['y', 'y'],
            ['z', 'z'],
            ['0', '0'],
            ['1', '1'],
            ['2', '2'],
            ['3', '3'],
            ['4', '4'],
            ['5', '5'],
            ['6', '6'],
            ['7', '7'],
            ['8', '8'],
            ['9', '9'],
          ],
        },
      },
      emu(block) {
        const keyValue = block.getFieldValue('KEY_OPTION');

        let branchCode = this.statementToCode(block);
        branchCode = this.addEventTrap(branchCode, block.id);
        branchCode = branchCode.replace('(done) => {\n', '(target, done) => {\n');

        const code = `runtime.when('keypressed:${keyValue}', ${branchCode}, target);\n`;
        return code;
      },
    },
    {
      // 当背景切换到
      id: 'whenbackdropswitchesto',
      text: ScratchBlocks.Msg.EVENT_WHENBACKDROPSWITCHESTO,
      hat: true,
      inputs: {
        BACKDROP: {
          shadowType: 'looks_backdrops',
        },
      },
      emu(block) {
        const backdropValue = block.getFieldValue('BACKDROP');

        let branchCode = this.statementToCode(block);
        branchCode = this.addEventTrap(branchCode, block.id);
        branchCode = branchCode.replace('(done) => {\n', '(target, done) => {\n');

        const code = `runtime.when('backdropswitchesto:${backdropValue}', ${branchCode}, target);\n`;
        return code;
      },
    },
    '---',
    {
      // 当计时器
      id: 'whengreaterthan',
      text: ScratchBlocks.Msg.EVENT_WHENGREATERTHAN,
      hat: true,
      inputs: {
        WHENGREATERTHANMENU: {
          type: 'string',
          menu: [[ScratchBlocks.Msg.EVENT_WHENGREATERTHAN_TIMER, 'TIMER']],
        },
        VALUE: {
          type: 'number',
          defaultValue: 10,
        },
      },
    },
    '---',
    {
      // 当收到广播
      id: 'whenbroadcastreceived',
      text: ScratchBlocks.Msg.EVENT_WHENBROADCASTRECEIVED,
      hat: true,
      inputs: {
        // 广播变量菜单
        BROADCAST_OPTION: {
          type: 'variable',
          variables: [ScratchBlocks.BROADCAST_MESSAGE_VARIABLE_TYPE],
          defaultValue: ScratchBlocks.Msg.DEFAULT_BROADCAST_MESSAGE_NAME,
        },
      },
      emu(block) {
        const messageName = this.getVariableName(block.getFieldValue('BROADCAST_OPTION')) || 'message1';

        let branchCode = this.statementToCode(block);
        branchCode = this.addEventTrap(branchCode, block.id);
        branchCode = branchCode.replace('(done) => {\n', '(target, done) => {\n');

        const code = `runtime.when('message:${messageName}', ${branchCode}, target);\n`;
        return code;
      },
    },
    {
      // 广播
      id: 'broadcast',
      text: ScratchBlocks.Msg.EVENT_BROADCAST,
      inputs: {
        BROADCAST_INPUT: {
          type: 'broadcast',
        },
      },
      emu(block) {
        const messageName = this.valueToCode(block, 'BROADCAST_INPUT', this.ORDER_NONE);
        const code = `runtime.run('message:' + ${messageName})\n`;
        return code;
      },
    },
    {
      // 广播并等待
      id: 'broadcastandwait',
      text: ScratchBlocks.Msg.EVENT_BROADCASTANDWAIT,
      inputs: {
        BROADCAST_INPUT: {
          type: 'broadcast',
        },
      },
      emu(block) {
        const messageName = this.valueToCode(block, 'BROADCAST_INPUT', this.ORDER_NONE);
        const code = `await runtime.run('message:' + ${messageName})\n`;
        return code;
      },
    },
  ],
});
