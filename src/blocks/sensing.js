import { themeColors, Text } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';

// 使用函数返回积木扩展对象，在切换语言时可以正确返回 ScratchBlocks.Msg 的翻译文本
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
          shadow: 'sensing_touchingobjectmenu',
          defaultValue: '_edge_',
        },
      },
      emu(block) {
        const touchingCode = this.valueToCode(block, 'TOUCHINGOBJECTMENU', this.ORDER_NONE);
        return [`runtime.isTouching(target, ${touchingCode})`, this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        const touchingCode = this.valueToCode(block, 'TOUCHINGOBJECTMENU', this.ORDER_NONE);
        return [`target.is_touching(${touchingCode})`, this.ORDER_FUNCTION_CALL];
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
          shadow: 'sensing_distancetomenu',
          defaultValue: '_center_',
        },
      },
      emu(block) {
        const distanceCode = this.valueToCode(block, 'DISTANCETOMENU', this.ORDER_NONE);
        return [`runtime.distanceTo(target, ${distanceCode})`, this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        let distanceCode = this.valueToCode(block, 'DISTANCETOMENU', this.ORDER_NONE);
        return [`target.distance(${distanceCode})`, this.ORDER_FUNCTION_CALL];
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
          inputMode: true,
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
        const keyCode = this.valueToCode(block, 'KEY_OPTION', this.ORDER_NONE);
        return [`runtime[${keyCode}+'Key']`, this.ORDER_MEMBER];
      },
      mpy(block) {
        const keyCode = this.valueToCode(block, 'KEY_OPTION', this.ORDER_NONE);
        return [`runtime.is_pressed(${keyCode})`, this.ORDER_MEMBER];
      },
    },
    {
      // 摇杆x轴
      id: 'joystick_x',
      text: (
        <Text
          id="arcade.blocks.joystick.x"
          defaultMessage="joystick x axis"
        />
      ),
      output: 'number',
      emu(block) {
        return ['runtime.joystick.x', this.ORDER_MEMBER];
      },
      mpy(block) {
        return ['-runtime.joystick.x_axis', this.ORDER_MEMBER];
      },
    },
    {
      // 摇杆y轴
      id: 'joystick_y',
      text: (
        <Text
          id="arcade.blocks.joystick.y"
          defaultMessage="joystick y axis"
        />
      ),
      output: 'number',
      emu(block) {
        return ['runtime.joystick.y', this.ORDER_MEMBER];
      },
      mpy(block) {
        return ['runtime.joystick.y_axis', this.ORDER_MEMBER];
      },
    },
    '---',
    {
      // 计时器
      id: 'timer',
      text: ScratchBlocks.Msg.SENSING_TIMER,
      output: 'number',
      emu(block) {
        return ['runtime.times', this.ORDER_MEMBER];
      },
      mpy(block) {
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
      mpy(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        code += 'runtime.reset_timer()\n';
        return code;
      },
    },
    '---',
    {
      // Wi-Fi 连接状态
      id: 'wificonnected',
      text: (
        <Text
          id="arcade.blocks.isConnected"
          defaultMessage="Wi-Fi is connected?"
        />
      ),
      output: 'boolean',
      emu(block) {
        return ['runtime.wifiConnected', this.ORDER_MEMBER];
      },
      mpy(block) {
        return ['runtime.wifi_connected', this.ORDER_MEMBER];
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
          shadow: 'sensing_of_object_menu',
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
      mpy(block) {
        let objectCode = this.valueToCode(block, 'OBJECT', this.ORDER_NONE);
        if (objectCode === '_stage_') {
          objectCode = 'stage';
        } else {
          objectCode = `stage.get_child(${objectCode})`;
        }
        const prop = block.getFieldValue('PROPERTY');
        switch (prop) {
          case 'x position':
            objectCode += '.x';
            break;
          case 'y position':
            objectCode += '.y';
            break;
          case 'direction':
            objectCode += '.direction';
            break;
          case 'costume #':
            objectCode += '.frame_number';
            break;
          case 'costume name':
            objectCode += '.frame_name';
            break;
          case 'size':
            objectCode += '.size';
            break;
          case 'backdrop #':
            objectCode += '.frame_number';
            break;
          case 'backdrop name':
            objectCode += '.frame_name';
            break;
          default:
            objectCode += '.frame_number';
            break;
        }
        return [objectCode, this.ORDER_MEMBER];
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
      mpy(block) {
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
        code = code ? this.quote_(code) : '_center_';
        return [code, this.ORDER_ATOMIC];
      },
      mpy(block) {
        let code = block.getFieldValue('DISTANCETOMENU');
        code = code ? this.quote_(code) : '_center_';
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
      mpy(block) {
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
      mpy(block) {
        let code = block.getFieldValue('OBJECT');
        code = code ? this.quote_(code) : '_stage_';
        return [code, this.ORDER_ATOMIC];
      },
    },
  ],
});
