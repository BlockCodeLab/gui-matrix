import { ArcadepyGenerator } from './generator';

const proto = ArcadepyGenerator.prototype;

proto['motion_movesteps'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const stepsCode = this.valueToCode(block, 'STEPS', this.ORDER_NONE) || 10;
  code += `target.move(num(${stepsCode}))\n`;
  return code;
};

proto['motion_turnright'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const degreesCode = this.valueToCode(block, 'DEGREES', this.ORDER_NONE) || 15;
  code += `target.direction += num(${degreesCode})\n`;
  return code;
};

proto['motion_turnleft'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const degreesCode = this.valueToCode(block, 'DEGREES', this.ORDER_NONE) || 15;
  code += `target.direction -= num(${degreesCode})\n`;
  return code;
};

proto['motion_pointindirection'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const directionCode = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || 90;
  code += `target.direction = num(${directionCode})\n`;
  return code;
};

proto['motion_pointtowards_menu'] = function (block) {
  return [block.getFieldValue('TOWARDS'), this.ORDER_ATOMIC];
};

proto['motion_pointtowards'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  let towardsCode = this.valueToCode(block, 'TOWARDS', this.ORDER_NONE) || '_random_';
  if (towardsCode === '_random_') {
    towardsCode = '';
  } else {
    towardsCode = `stage.get_child('${towardsCode}')`;
  }
  code += `target.towards(${towardsCode})\n`;
  return code;
};

proto['motion_gotoxy'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const xCode = this.valueToCode(block, 'X', this.ORDER_NONE) || 0;
  const yCode = this.valueToCode(block, 'Y', this.ORDER_NONE) || 0;
  code += `target.goto(num(${xCode}), num(${yCode}))\n`;
  return code;
};

proto['motion_goto_menu'] = function (block) {
  return [block.getFieldValue('TO'), this.ORDER_ATOMIC];
};

proto['motion_goto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  let toCode = this.valueToCode(block, 'TO', this.ORDER_NONE) || '_random_';
  if (toCode === '_random_') {
    toCode = '';
  } else {
    toCode = `stage.get_child('${toCode}')`;
  }
  code += `target.goto(${toCode})\n`;
  return code;
};

proto['motion_glidesecstoxy'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const secsCode = this.valueToCode(block, 'SECS', this.ORDER_NONE) || 1;
  const xCode = this.valueToCode(block, 'X', this.ORDER_NONE) || 0;
  const yCode = this.valueToCode(block, 'Y', this.ORDER_NONE) || 0;
  code += `await target.glide(num(${secsCode}), num(${xCode}), num(${yCode}))\n`;
  return code;
};

proto['motion_glideto_menu'] = proto['motion_goto_menu'];

proto['motion_glideto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const secsCode = this.valueToCode(block, 'SECS', this.ORDER_NONE) || 1;
  let toCode = this.valueToCode(block, 'TO', this.ORDER_NONE) || '_random_';
  if (toCode === '_random_') {
    toCode = '';
  } else {
    toCode = `stage.get_child('${toCode}')`;
  }
  code += `await target.glide(num(${secsCode}), ${toCode})\n`;
  return code;
};

proto['motion_changexby'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const dxCode = this.valueToCode(block, 'DX', this.ORDER_NONE) || 10;
  code += `target.x += num(${dxCode})\n`;
  return code;
};

proto['motion_setx'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const xCode = this.valueToCode(block, 'X', this.ORDER_NONE) || 0;
  code += `target.x = num(${xCode})\n`;
  return code;
};

proto['motion_changeyby'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const dyCode = this.valueToCode(block, 'DY', this.ORDER_NONE) || 10;
  code += `target.y += num(${dyCode})\n`;
  return code;
};

proto['motion_sety'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const yCode = this.valueToCode(block, 'Y', this.ORDER_NONE) || 0;
  code += `target.y = num(${yCode})\n`;
  return code;
};

proto['motion_ifonedgebounce'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += 'target.edge_bounce()\n';
  return code;
};

proto['motion_setrotationstyle'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  let styleCode;
  const styleValue = block.getFieldValue('STYLE');
  switch (styleValue) {
    case 'left-right':
      styleCode = 'ROTATION_STYLE_HORIZONTAL_FLIP';
      break;
    case `don't rotate`:
      styleCode = 'ROTATION_STYLE_DONOT_ROTATE';
      break;
    case 'all around':
      styleCode = 'ROTATION_STYLE_ALL_AROUND';
    default:
      break;
  }
  code += `target.rotation_style = ${styleCode}\n`;
  return code;
};

proto['motion_xposition'] = function () {
  return ['target.x', this.ORDER_NONE];
};

proto['motion_yposition'] = function () {
  return ['target.y', this.ORDER_NONE];
};

proto['motion_direction'] = function () {
  return ['target.direction', this.ORDER_NONE];
};
