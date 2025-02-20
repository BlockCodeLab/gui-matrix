import { MatrixemuGenerator } from './generator';
import { RotationStyle } from '../../components/emulator/emulator-config';

const proto = MatrixemuGenerator.prototype;

proto['motion_movesteps'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const stepsCode = this.valueToCode(block, 'STEPS', this.ORDER_NONE) || '10';
  code += `targetUtils.moveSteps(target, ${stepsCode});\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['motion_turnright'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const degreesCode = this.valueToCode(block, 'DEGREES', this.ORDER_NONE) || '15';
  code += `targetUtils.turnRight(target, ${degreesCode});\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['motion_turnleft'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const degreesCode = this.valueToCode(block, 'DEGREES', this.ORDER_NONE) || '15';
  code += `targetUtils.turnLeft(target, ${degreesCode});\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['motion_pointindirection'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const directionCode = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || '90';
  code += `targetUtils.towardsTo(target, ${directionCode});\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['motion_pointtowards_menu'] = function (block) {
  return [this.quote_(block.getFieldValue('TOWARDS')), this.ORDER_ATOMIC];
};

proto['motion_pointtowards'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const towardsCode = this.valueToCode(block, 'TOWARDS', this.ORDER_NONE) || `'_random_'`;
  code += `targetUtils.towardsToTarget(target, ${towardsCode});\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['motion_gotoxy'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const xCode = this.valueToCode(block, 'X', this.ORDER_NONE) || '0';
  const yCode = this.valueToCode(block, 'Y', this.ORDER_NONE) || '0';
  code += `targetUtils.moveTo(target, ${xCode}, ${yCode});\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['motion_goto_menu'] = function (block) {
  return [this.quote_(block.getFieldValue('TO')), this.ORDER_ATOMIC];
};

proto['motion_goto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const toCode = this.valueToCode(block, 'TO', this.ORDER_NONE) || `'_random_'`;
  code += `targetUtils.moveToTarget(target, ${toCode});\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['motion_glidesecstoxy'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const secsCode = this.valueToCode(block, 'SECS', this.ORDER_NONE) || '1';
  const xCode = this.valueToCode(block, 'X', this.ORDER_NONE) || '0';
  const yCode = this.valueToCode(block, 'Y', this.ORDER_NONE) || '0';

  code += `await targetUtils.glideTo(target, signal, ${secsCode}, ${xCode}, ${yCode});\n`;
  return code;
};

proto['motion_glideto_menu'] = proto['motion_goto_menu'];

proto['motion_glideto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const secsCode = this.valueToCode(block, 'SECS', this.ORDER_NONE) || '1';
  const toCode = this.valueToCode(block, 'TO', this.ORDER_NONE) || `'_random_'`;

  code += `await targetUtils.glideToTarget(target, signal, ${secsCode}, ${toCode});\n`;
  return code;
};

proto['motion_changexby'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const dxCode = this.valueToCode(block, 'DX', this.ORDER_NONE) || '10';
  code += `targetUtils.addX(target, ${dxCode});\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['motion_setx'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const xCode = this.valueToCode(block, 'X', this.ORDER_NONE) || '0';
  code += `targetUtils.setX(target, ${xCode});\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['motion_changeyby'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const dyCode = this.valueToCode(block, 'DY', this.ORDER_NONE) || '10';
  code += `targetUtils.addY(target, ${dyCode});\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['motion_sety'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const yCode = this.valueToCode(block, 'Y', this.ORDER_NONE) || '0';
  code += `targetUtils.setY(target, ${yCode});\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['motion_ifonedgebounce'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += 'targetUtils.edgeBounce(target);\n';
  code += 'renderMode = true;\n';
  return code;
};

proto['motion_setrotationstyle'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const styleCode = RotationStyle[block.getFieldValue('STYLE')];
  code += `targetUtils.setRotationStyle(target, ${styleCode});\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['motion_xposition'] = function () {
  return ['target.x()', this.ORDER_FUNCTION_CALL];
};

proto['motion_yposition'] = function () {
  return ['target.y()', this.ORDER_FUNCTION_CALL];
};

proto['motion_direction'] = function () {
  return [`target.getAttr('direction')`, this.ORDER_FUNCTION_CALL];
};
