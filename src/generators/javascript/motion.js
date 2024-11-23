import { javascriptGenerator } from './generator';

javascriptGenerator['motion_movesteps'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const stepsCode = this.valueToCode(block, 'STEPS', this.ORDER_NONE) || 10;
  code += `target.util.move(runtime.number(${stepsCode}));\n`;
  return code;
};

javascriptGenerator['motion_turnright'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const degreesCode = this.valueToCode(block, 'DEGREES', this.ORDER_NONE) || 15;
  code += `target.util.direction += runtime.number(${degreesCode});\n`;
  return code;
};

javascriptGenerator['motion_turnleft'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const degreesCode = this.valueToCode(block, 'DEGREES', this.ORDER_NONE) || 15;
  code += `target.util.direction -= runtime.number(${degreesCode});\n`;
  return code;
};

javascriptGenerator['motion_pointindirection'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const directionCode = this.valueToCode(block, 'DIRECTION', this.ORDER_NONE) || 90;
  code += `target.util.direction = runtime.number(${directionCode});\n`;
  return code;
};

javascriptGenerator['motion_pointtowards_menu'] = function (block) {
  return [block.getFieldValue('TOWARDS'), this.ORDER_ATOMIC];
};

javascriptGenerator['motion_pointtowards'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  let towardsCode = this.valueToCode(block, 'TOWARDS', this.ORDER_NONE);
  if (towardsCode === '_random_') {
    towardsCode = `runtime.random(1, 360)`;
  } else {
    towardsCode = `runtime.getSpriteByIdOrName('${towardsCode}').util`;
  }
  code += `target.util.towards(${towardsCode});\n`;
  return code;
};

javascriptGenerator['motion_gotoxy'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const xCode = this.valueToCode(block, 'X', this.ORDER_NONE) || 0;
  const yCode = this.valueToCode(block, 'Y', this.ORDER_NONE) || 0;
  code += `target.util.goto(runtime.number(${xCode}), runtime.number(${yCode}));\n`;
  return code;
};

javascriptGenerator['motion_goto_menu'] = function (block) {
  return [block.getFieldValue('TO'), this.ORDER_ATOMIC];
};

javascriptGenerator['motion_goto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  let toCode = this.valueToCode(block, 'TO', this.ORDER_NONE) || '_random_';
  if (toCode === '_random_') {
    toCode = `{ x: runtime.random('width'), y: runtime.random('height') }`;
  } else {
    toCode = `runtime.getSpriteByIdOrName('${toCode}').util`;
  }
  code += `target.util.goto(${toCode});\n`;
  return code;
};

javascriptGenerator['motion_glidesecstoxy'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const secsCode = this.valueToCode(block, 'SECS', this.ORDER_NONE) || 1;
  const xCode = this.valueToCode(block, 'X', this.ORDER_NONE) || 0;
  const yCode = this.valueToCode(block, 'Y', this.ORDER_NONE) || 0;
  const toCode = `{ x: runtime.number(${xCode}), y: runtime.number(${yCode}) }`;
  code += this.wrapAsync(`target.util.glide(runtime.number(flash ? 0 : ${secsCode}), ${toCode});`);
  return code;
};

javascriptGenerator['motion_glideto_menu'] = javascriptGenerator['motion_goto_menu'];

javascriptGenerator['motion_glideto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const secsCode = this.valueToCode(block, 'SECS', this.ORDER_NONE) || 1;
  let toCode = this.valueToCode(block, 'TO', this.ORDER_NONE) || '_random_';
  if (toCode === '_random_') {
    toCode = `{ x: runtime.random('width'), y: runtime.random('height') }`;
  } else {
    toCode = `runtime.getSpriteByIdOrName('${toCode}').util`;
  }
  code += this.wrapAsync(`target.util.glide(runtime.number(flash ? 0 : ${secsCode}), ${toCode})`);
  return code;
};

javascriptGenerator['motion_changexby'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const dxCode = this.valueToCode(block, 'DX', this.ORDER_NONE) || 10;
  code += `target.util.x += runtime.number(${dxCode});\n`;
  return code;
};

javascriptGenerator['motion_setx'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const xCode = this.valueToCode(block, 'X', this.ORDER_NONE) || 0;
  code += `target.util.x = runtime.number(${xCode});\n`;
  return code;
};

javascriptGenerator['motion_changeyby'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const dyCode = this.valueToCode(block, 'DY', this.ORDER_NONE) || 10;
  code += `target.util.y += runtime.number(${dyCode});\n`;
  return code;
};

javascriptGenerator['motion_sety'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const yCode = this.valueToCode(block, 'Y', this.ORDER_NONE) || 0;
  code += `target.util.y = runtime.number(${yCode});\n`;
  return code;
};

javascriptGenerator['motion_ifonedgebounce'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += 'target.util.edgeBounce();\n';
  return code;
};

javascriptGenerator['motion_setrotationstyle'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  let styleCode;
  const styleValue = block.getFieldValue('STYLE');
  switch (styleValue) {
    case 'left-right':
      styleCode = 'HORIZONTAL_FLIP';
      break;
    case `don't rotate`:
      styleCode = 'DONOT_ROTATE';
      break;
    case 'all around':
      styleCode = 'ALL_AROUND';
    default:
      break;
  }
  code += `target.util.rotationStyle = runtime.RotationStyle.${styleCode};\n`;
  return code;
};

javascriptGenerator['motion_xposition'] = function () {
  return ['target.util.x', this.ORDER_NONE];
};

javascriptGenerator['motion_yposition'] = function () {
  return ['target.util.y', this.ORDER_NONE];
};

javascriptGenerator['motion_direction'] = function () {
  return ['target.util.direction', this.ORDER_NONE];
};
