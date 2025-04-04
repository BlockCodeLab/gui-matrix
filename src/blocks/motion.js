import { themeColors } from '@blockcode/core';
import { ScratchBlocks } from '@blockcode/blocks';
import { RotationStyle } from '../components/emulator/emulator-config';

export default (x, y) => ({
  id: 'motion',
  name: '%{BKY_CATEGORY_MOTION}',
  themeColor: themeColors.blocks.motion.primary,
  inputColor: themeColors.blocks.motion.secondary,
  otherColor: themeColors.blocks.motion.tertiary,
  order: 0,
  blocks: [
    {
      // 移动
      id: 'movesteps',
      text: ScratchBlocks.Msg.MOTION_MOVESTEPS,
      forStage: false,
      inputs: {
        STEPS: {
          type: 'number',
          defaultValue: 10,
        },
      },
      emu(block) {
        const stepsCode = this.valueToCode(block, 'STEPS', this.ORDER_NONE);

        let code = '';
        code += `targetUtils.moveSteps(target, ${stepsCode});\n`;
        code += 'renderMode = true;\n';
        return code;
      },
    },
    {
      // 右转
      id: 'turnright',
      text: ScratchBlocks.Msg.MOTION_TURNRIGHT,
      forStage: false,
      inputs: {
        IMAGE: {
          type: 'image',
          src: './assets/blocks-media/rotate-right.svg',
        },
        DEGREES: {
          type: 'number',
          defaultValue: 15,
        },
      },
      emu(block) {
        const degreesCode = this.valueToCode(block, 'DEGREES', this.ORDER_NONE);

        let code = '';
        code += `targetUtils.turnRight(target, ${degreesCode});\n`;
        code += 'renderMode = true;\n';
        return code;
      },
    },
    {
      // 左转
      id: 'turnleft',
      text: ScratchBlocks.Msg.MOTION_TURNLEFT,
      forStage: false,
      inputs: {
        IMAGE: {
          type: 'image',
          src: './assets/blocks-media/rotate-left.svg',
        },
        DEGREES: {
          type: 'number',
          defaultValue: 15,
        },
      },
      emu(block) {
        const degreesCode = this.valueToCode(block, 'DEGREES', this.ORDER_NONE);

        let code = '';
        code += `targetUtils.turnLeft(target, ${degreesCode});\n`;
        code += 'renderMode = true;\n';
        return code;
      },
    },
    '---',
    {
      // 移到
      id: 'goto',
      text: ScratchBlocks.Msg.MOTION_GOTO,
      forStage: false,
      inputs: {
        TO: {
          shadowType: 'motion_goto_menu',
        },
      },
      emu(block) {
        let toCode = this.valueToCode(block, 'TO', this.ORDER_NONE);
        if (toCode === '_random_') {
          toCode = this.quote_(toCode);
        }

        let code = '';
        code += `targetUtils.moveToTarget(target, ${toCode});\n`;
        code += 'renderMode = true;\n';
        return code;
      },
    },
    {
      // 移到xy
      id: 'gotoxy',
      text: ScratchBlocks.Msg.MOTION_GOTOXY,
      forStage: false,
      inputs: {
        X: {
          id: 'movex',
          type: 'number',
          defaultValue: x || 0,
        },
        Y: {
          id: 'movey',
          type: 'number',
          defaultValue: y || 0,
        },
      },
      emu(block) {
        const xCode = this.valueToCode(block, 'X', this.ORDER_NONE);
        const yCode = this.valueToCode(block, 'Y', this.ORDER_NONE);

        let code = '';
        code += `targetUtils.moveTo(target, ${xCode}, ${yCode});\n`;
        code += 'renderMode = true;\n';
        return code;
      },
    },
    {
      // 滑行
      id: 'glideto',
      text: ScratchBlocks.Msg.MOTION_GLIDETO,
      forStage: false,
      inputs: {
        SECS: {
          type: 'number',
          defaultValue: 1,
        },
        TO: {
          shadowType: 'motion_glideto_menu',
        },
      },
      emu(block) {
        const secsCode = this.valueToCode(block, 'SECS', this.ORDER_NONE);
        let toCode = this.valueToCode(block, 'TO', this.ORDER_NONE);
        if (toCode === '_random_') {
          toCode = this.quote_(toCode);
        }

        let code = '';
        code += `await targetUtils.glideToTarget(target, signal, ${secsCode}, ${toCode});\n`;
        return code;
      },
    },
    {
      // 滑行xy
      id: 'glidesecstoxy',
      text: ScratchBlocks.Msg.MOTION_GLIDESECSTOXY,
      forStage: false,
      inputs: {
        SECS: {
          type: 'number',
          defaultValue: 1,
        },
        X: {
          id: 'glidex',
          type: 'number',
          defaultValue: x || 0,
        },
        Y: {
          id: 'glidey',
          type: 'number',
          defaultValue: y || 0,
        },
      },
      emu(block) {
        const secsCode = this.valueToCode(block, 'SECS', this.ORDER_NONE);
        const xCode = this.valueToCode(block, 'X', this.ORDER_NONE);
        const yCode = this.valueToCode(block, 'Y', this.ORDER_NONE);
        const code = `await targetUtils.glideTo(target, signal, ${secsCode}, ${xCode}, ${yCode});\n`;
        return code;
      },
    },
    '---',
    {
      // 面向方向
      id: 'pointindirection',
      text: ScratchBlocks.Msg.MOTION_POINTINDIRECTION,
      forStage: false,
      inputs: {
        DIRECTION: {
          type: 'angle',
          defaultValue: 90,
        },
      },
      emu(block) {
        const directionCode = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE);

        let code = '';
        code += `targetUtils.towardsTo(target, ${directionCode});\n`;
        code += 'renderMode = true;\n';
        return code;
      },
    },
    {
      // 面向
      id: 'pointtowards',
      text: ScratchBlocks.Msg.MOTION_POINTTOWARDS,
      forStage: false,
      inputs: {
        TOWARDS: {
          shadowType: 'motion_pointtowards_menu',
        },
      },
      emu(block) {
        let towardsCode = this.valueToCode(block, 'TOWARDS', this.ORDER_NONE);
        if (towardsCode === '_random_') {
          towardsCode = this.quote_(towardsCode);
        }

        let code = '';
        code += `targetUtils.towardsToTarget(target, ${towardsCode});\n`;
        code += 'renderMode = true;\n';
        return code;
      },
    },
    '---',
    {
      // 改变x
      id: 'changexby',
      text: ScratchBlocks.Msg.MOTION_CHANGEXBY,
      forStage: false,
      inputs: {
        DX: {
          type: 'number',
          defaultValue: 10,
        },
      },
      emu(block) {
        const dxCode = this.valueToCode(block, 'DX', this.ORDER_NONE);

        let code = '';
        code += `targetUtils.addX(target, ${dxCode});\n`;
        code += 'renderMode = true;\n';
        return code;
      },
    },
    {
      // 设置x
      id: 'setx',
      text: ScratchBlocks.Msg.MOTION_SETX,
      forStage: false,
      inputs: {
        X: {
          id: 'setx',
          type: 'number',
          defaultValue: x || 0,
        },
      },
      emu(block) {
        const xCode = this.valueToCode(block, 'X', this.ORDER_NONE);

        let code = '';
        code += `targetUtils.setX(target, ${xCode});\n`;
        code += 'renderMode = true;\n';
        return code;
      },
    },
    {
      // 改变y
      id: 'changeyby',
      text: ScratchBlocks.Msg.MOTION_CHANGEYBY,
      forStage: false,
      inputs: {
        DY: {
          type: 'number',
          defaultValue: 10,
        },
      },
      emu(block) {
        const dyCode = this.valueToCode(block, 'DY', this.ORDER_NONE);

        let code = '';
        code += `targetUtils.addY(target, ${dyCode});\n`;
        code += 'renderMode = true;\n';
        return code;
      },
    },
    {
      // 设置y
      id: 'sety',
      text: ScratchBlocks.Msg.MOTION_SETY,
      forStage: false,
      inputs: {
        Y: {
          id: 'sety',
          type: 'number',
          defaultValue: y || 0,
        },
      },
      emu(block) {
        const yCode = this.valueToCode(block, 'Y', this.ORDER_NONE);

        let code = '';
        code += `targetUtils.setY(target, ${yCode});\n`;
        code += 'renderMode = true;\n';
        return code;
      },
    },
    '---',
    {
      // 碰到边缘
      id: 'ifonedgebounce',
      text: ScratchBlocks.Msg.MOTION_IFONEDGEBOUNCE,
      forStage: false,
      emu(block) {
        let code = '';
        code += 'targetUtils.edgeBounce(target);\n';
        code += 'render_mode = true\n';
        return code;
      },
    },
    '---',
    {
      // 旋转模式
      id: 'setrotationstyle',
      text: ScratchBlocks.Msg.MOTION_SETROTATIONSTYLE,
      forStage: false,
      inputs: {
        STYLE: {
          type: 'string',
          menu: [
            [ScratchBlocks.Msg.MOTION_SETROTATIONSTYLE_LEFTRIGHT, 'left-right'],
            [ScratchBlocks.Msg.MOTION_SETROTATIONSTYLE_DONTROTATE, "don't rotate"],
            [ScratchBlocks.Msg.MOTION_SETROTATIONSTYLE_ALLAROUND, 'all around'],
          ],
        },
      },
      emu(block) {
        const styleCode = RotationStyle[block.getFieldValue('STYLE')] ?? RotationStyle.AllAround;

        let code = '';
        code += `targetUtils.setRotationStyle(target, ${styleCode});\n`;
        code += 'renderMode = true;\n';
        return code;
      },
    },
    '---',
    {
      // 设置舞台边缘模式
      id: 'setfencing',
      text: (
        <Text
          id="matrix.blocks.fencing"
          defaultMessage="%1 stage fencing"
        />
      ),
      inputs: {
        MODE: {
          type: 'string',
          defaultValue: 'disable',
          menu: [
            [
              <Text
                id="matrix.blocks.fencingEnable"
                defaultMessage="enable"
              />,
              'enable',
            ],
            [
              <Text
                id="matrix.blocks.fencingDisable"
                defaultMessage="disable"
              />,
              'disable',
            ],
          ],
        },
      },
      emu(block) {
        const mode = block.getFieldValue('MODE') || 'disable';
        const code = `runtime.setFencingMode(${mode === 'enable'});\n`;
        return code;
      },
      mpy(block) {
        const mode = block.getFieldValue('MODE') || 'disable';
        const code = `target.set_fencing_mode(${mode !== 'disable' ? 'True' : 'False'});\n`;
        return code;
      },
    },
    '---',
    {
      // x
      id: 'xposition',
      text: ScratchBlocks.Msg.MOTION_XPOSITION,
      forStage: false,
      output: 'number',
      emu(block) {
        return ['target.x()', this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // y
      id: 'yposition',
      text: ScratchBlocks.Msg.MOTION_YPOSITION,
      forStage: false,
      output: 'number',
      emu(block) {
        return ['target.y()', this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // 方向
      id: 'direction',
      text: ScratchBlocks.Msg.MOTION_DIRECTION,
      forStage: false,
      output: 'number',
      emu(block) {
        const code = `target.getAttr('direction')`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      // 移到菜单
      id: 'goto_menu',
      emu(block) {
        let code = block.getFieldValue('TO') || '_random_';
        if (code !== '_random_') {
          code = this.quote_(code);
        }
        return [code, this.ORDER_ATOMIC];
      },
    },
    {
      // 滑行菜单
      id: 'glideto_menu',
      emu(block) {
        let code = block.getFieldValue('TO') || '_random_';
        if (code !== '_random_') {
          code = this.quote_(code);
        }
        return [code, this.ORDER_ATOMIC];
      },
    },
    {
      // 面向菜单
      id: 'pointtowards_menu',
      emu(block) {
        let code = block.getFieldValue('TOWARDS') || '_random_';
        if (code !== '_random_') {
          code = this.quote_(code);
        }
        return [code, this.ORDER_ATOMIC];
      },
    },
  ],
});
