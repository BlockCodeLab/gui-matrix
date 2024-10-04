import { pythonGenerator } from './generator';

pythonGenerator['motion_movesteps'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const stepsCode = pythonGenerator.valueToCode(block, 'STEPS', pythonGenerator.ORDER_NONE) || 10;
  code += `target.move(num(${stepsCode}))\n`;
  return code;
};

pythonGenerator['motion_turnright'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const degreesCode = pythonGenerator.valueToCode(block, 'DEGREES', pythonGenerator.ORDER_NONE) || 15;
  code += `target.direction += num(${degreesCode})\n`;
  return code;
};

pythonGenerator['motion_turnleft'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const degreesCode = pythonGenerator.valueToCode(block, 'DEGREES', pythonGenerator.ORDER_NONE) || 15;
  code += `target.direction -= num(${degreesCode})\n`;
  return code;
};

pythonGenerator['motion_pointindirection'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const directionCode = pythonGenerator.valueToCode(block, 'DIRECTION', pythonGenerator.ORDER_NONE) || 90;
  code += `target.direction = num(${directionCode})\n`;
  return code;
};

pythonGenerator['motion_pointtowards_menu'] = (block) => {
  return [block.getFieldValue('TOWARDS'), pythonGenerator.ORDER_ATOMIC];
};

pythonGenerator['motion_pointtowards'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }

  let towardsCode = pythonGenerator.valueToCode(block, 'TOWARDS', pythonGenerator.ORDER_NONE) || '_random_';
  if (towardsCode === '_random_') {
    towardsCode = '';
  } else {
    towardsCode = `stage.get_child('${towardsCode}')`;
  }
  code += `target.towards(${towardsCode})\n`;
  return code;
};

pythonGenerator['motion_gotoxy'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const xCode = pythonGenerator.valueToCode(block, 'X', pythonGenerator.ORDER_NONE) || 0;
  const yCode = pythonGenerator.valueToCode(block, 'Y', pythonGenerator.ORDER_NONE) || 0;
  code += `target.goto(num(${xCode}), num(${yCode}))\n`;
  return code;
};

pythonGenerator['motion_goto_menu'] = (block) => {
  return [block.getFieldValue('TO'), pythonGenerator.ORDER_ATOMIC];
};

pythonGenerator['motion_goto'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }

  let toCode = pythonGenerator.valueToCode(block, 'TO', pythonGenerator.ORDER_NONE) || '_random_';
  if (toCode === '_random_') {
    toCode = '';
  } else {
    toCode = `stage.get_child('${toCode}')`;
  }
  code += `target.goto(${toCode})\n`;
  return code;
};

pythonGenerator['motion_glidesecstoxy'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }

  const secsCode = pythonGenerator.valueToCode(block, 'SECS', pythonGenerator.ORDER_NONE) || 1;
  const xCode = pythonGenerator.valueToCode(block, 'X', pythonGenerator.ORDER_NONE) || 0;
  const yCode = pythonGenerator.valueToCode(block, 'Y', pythonGenerator.ORDER_NONE) || 0;
  code += `await target.glide(num(${secsCode}), num(${xCode}), num(${yCode}))\n`;
  return code;
};

pythonGenerator['motion_glideto_menu'] = pythonGenerator['motion_goto_menu'];

pythonGenerator['motion_glideto'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }

  const secsCode = pythonGenerator.valueToCode(block, 'SECS', pythonGenerator.ORDER_NONE) || 1;
  let toCode = pythonGenerator.valueToCode(block, 'TO', pythonGenerator.ORDER_NONE) || '_random_';
  if (toCode === '_random_') {
    toCode = '';
  } else {
    toCode = `stage.get_child('${toCode}')`;
  }
  code += `await target.glide(num(${secsCode}), ${toCode})\n`;
  return code;
};

pythonGenerator['motion_changexby'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const dxCode = pythonGenerator.valueToCode(block, 'DX', pythonGenerator.ORDER_NONE) || 10;
  code += `target.x += num(${dxCode})\n`;
  return code;
};

pythonGenerator['motion_setx'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const xCode = pythonGenerator.valueToCode(block, 'X', pythonGenerator.ORDER_NONE) || 0;
  code += `target.x = num(${xCode})\n`;
  return code;
};

pythonGenerator['motion_changeyby'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const dyCode = pythonGenerator.valueToCode(block, 'DY', pythonGenerator.ORDER_NONE) || 10;
  code += `target.y += num(${dyCode})\n`;
  return code;
};

pythonGenerator['motion_sety'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const yCode = pythonGenerator.valueToCode(block, 'Y', pythonGenerator.ORDER_NONE) || 0;
  code += `target.y = num(${yCode})\n`;
  return code;
};

pythonGenerator['motion_ifonedgebounce'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  code += 'target.edge_bounce()\n';
  return code;
};

pythonGenerator['motion_setrotationstyle'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
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

pythonGenerator['motion_xposition'] = () => {
  return ['target.x', pythonGenerator.ORDER_NONE];
};

pythonGenerator['motion_yposition'] = () => {
  return ['target.y', pythonGenerator.ORDER_NONE];
};

pythonGenerator['motion_direction'] = () => {
  return ['target.direction', pythonGenerator.ORDER_NONE];
};
