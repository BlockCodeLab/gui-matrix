import { themeColors } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';

export default () => ({
  id: 'sensing',
  name: '%{BKY_CATEGORY_SENSING}',
  themeColor: themeColors.blocks.sensing.primary,
  inputColor: themeColors.blocks.sensing.secondary,
  otherColor: themeColors.blocks.sensing.tertiary,
  blocks: [
    {
      // 碰到物体
      id: 'touchingobject',
      text: ScratchBlocks.Msg.SENSING_TOUCHINGOBJECT,
      forStage: false,
      output: 'boolean',
      inputs: {
        TOUCHINGOBJECTMENU: {
          shadowType: 'sensing_touchingobjectmenu',
          defaultValue: '_mouse_',
        },
      },
      emu(block) {
        const touchingCode = this.valueToCode(block, 'TOUCHINGOBJECTMENU', this.ORDER_NONE);
        return [`runtime.isTouching(target, ${touchingCode})`, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // 距离
      id: 'distanceto',
      text: ScratchBlocks.Msg.SENSING_DISTANCETO,
      forStage: false,
      output: 'number',
      inputs: {
        DISTANCETOMENU: {
          shadowType: 'sensing_distancetomenu',
          defaultValue: '_mouse_',
        },
      },
      emu(block) {
        const distanceCode = this.valueToCode(block, 'DISTANCETOMENU', this.ORDER_NONE);
        return [`runtime.distanceTo(target, ${distanceCode})`, this.ORDER_FUNCTION_CALL];
      },
    },
    '---',
    {
      // 按键按下
      id: 'keypressed',
      text: ScratchBlocks.Msg.SENSING_KEYPRESSED,
      output: 'boolean',
      inputs: {
        KEY_OPTION: {
          shadowType: 'sensing_keyoptions',
          defaultValue: 'space',
        },
      },
      emu(block) {
        const keyCode = this.valueToCode(block, 'KEY_OPTION', this.ORDER_NONE);
        this.renderLoopTrap();
        return [`runtime[${keyCode}+'Key']`, this.ORDER_MEMBER];
      },
    },
    '---',
    {
      // 计时器
      id: 'timer',
      text: ScratchBlocks.Msg.SENSING_TIMER,
      output: 'number',
      monitoring: true,
      emu(block) {
        return ['runtime.times', this.ORDER_MEMBER];
      },
    },
    {
      // 重置计时器
      id: 'resettimer',
      text: ScratchBlocks.Msg.SENSING_RESETTIMER,
      emu(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        code += 'runtime.resetTimes()\n';
        return code;
      },
    },
    '---',
    {
      // 属性
      id: 'of',
      text: ScratchBlocks.Msg.SENSING_OF,
      output: 'string',
      inputs: {
        PROPERTY: {
          type: 'string',
          menu: [''],
        },
        OBJECT: {
          shadowType: 'sensing_of_object_menu',
        },
      },
      emu(block) {
        const objectCode = this.valueToCode(block, 'OBJECT', this.ORDER_NONE);
        let propCode;
        switch (block.getFieldValue('PROPERTY')) {
          case 'x position':
            propCode = 'x';
            break;
          case 'y position':
            propCode = 'y';
            break;
          case 'direction':
            propCode = 'direction';
            break;
          case 'costume #':
            propCode = 'frameSerial';
            break;
          case 'costume name':
            propCode = 'frameName';
            break;
          case 'size':
            propCode = 'scaleSize';
            break;
          case 'backdrop #':
            propCode = 'frameSerial';
            break;
          case 'backdrop name':
            propCode = 'frameName';
            break;
          default:
            propCode = 'frameSerial';
            break;
        }
        return [`runtime.sensingOf(${objectCode}, '${propCode}')`, this.ORDER_MEMBER];
      },
    },
    {
      // 碰撞菜单
      id: 'touchingobjectmenu',
      emu(block) {
        let code = block.getFieldValue('TOUCHINGOBJECTMENU');
        code = code ? this.quote_(code) : '_edge_';
        return [code, this.ORDER_ATOMIC];
      },
    },
    {
      // 距离菜单
      id: 'distancetomenu',
      emu(block) {
        let code = block.getFieldValue('DISTANCETOMENU');
        code = code ? this.quote_(code) : '_mouse_';
        return [code, this.ORDER_ATOMIC];
      },
    },
    {
      // 按键菜单
      id: 'keyoptions',
      emu(block) {
        const code = this.quote_(block.getFieldValue('KEY_OPTION') || 'a');
        return [code, this.ORDER_NONE];
      },
    },
    {
      // 属性对象菜单
      id: 'of_object_menu',
      emu(block) {
        let code = block.getFieldValue('OBJECT');
        code = code ? this.quote_(code) : '_stage_';
        return [code, this.ORDER_ATOMIC];
      },
    },
  ],
});
