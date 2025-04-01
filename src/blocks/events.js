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
          defaultValue: 'a',
          menu: [
            [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_UP, 'up'],
            [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_DOWN, 'down'],
            [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_LEFT, 'left'],
            [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_RIGHT, 'right'],
            ['a', 'a'],
            ['b', 'b'],
            ['x', 'x'],
            ['y', 'y'],
            [
              <Text
                id="arcade.blocks.fnButton"
                defaultMessage="fn"
              />,
              'fn',
            ],
            [ScratchBlocks.Msg.EVENT_WHENKEYPRESSED_ANY, 'any'],
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
      mpy(block) {
        const keyValue = block.getFieldValue('KEY_OPTION');

        let branchCode = this.statementToCode(block);
        branchCode = this.addEventTrap(branchCode, block.id);
        branchCode = branchCode.replace('():\n', '(target):\n');

        let code = '';
        code += `@when_keypressed("${keyValue}", target)\n`;
        code += branchCode;
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
      mpy(block) {
        const backdropValue = block.getFieldValue('BACKDROP');

        let branchCode = this.statementToCode(block);
        branchCode = this.addEventTrap(branchCode, block.id);
        branchCode = branchCode.replace('():\n', '(target):\n');

        let code = '';
        code += `@when_backdropswitchesto("${backdropValue}", target)\n`;
        code += branchCode;
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
      mpy(block) {
        const messageName = this.getVariableName(block.getFieldValue('BROADCAST_OPTION')) || 'message1';

        let branchCode = this.statementToCode(block);
        branchCode = this.addEventTrap(branchCode, block.id);
        branchCode = branchCode.replace('():\n', '(target):\n');

        let code = '';
        code += `@when_broadcastreceived("${messageName}", target)\n`;
        code += branchCode;
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
      mpy(block) {
        const messageName = this.valueToCode(block, 'BROADCAST_INPUT', this.ORDER_NONE);
        const code = `runtime.broadcast(${messageName})\n`;
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
      mpy(block) {
        const messageName = this.valueToCode(block, 'BROADCAST_INPUT', this.ORDER_NONE);
        const code = `await runtime.broadcast(${messageName}, waiting=True)\n`;
        return code;
      },
    },
  ],
});
