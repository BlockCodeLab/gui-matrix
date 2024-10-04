import { javascriptGenerator } from './generator';

const AWAIT_ABORT = 'if (abort || !runtime.running) break;\n';

javascriptGenerator['motion_movesteps'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const stepsCode = javascriptGenerator.valueToCode(block, 'STEPS', javascriptGenerator.ORDER_NONE) || 10;
  code += `target.util.move(runtime.number(${stepsCode}));\n`;
  return code;
};

javascriptGenerator['motion_turnright'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const degreesCode = javascriptGenerator.valueToCode(block, 'DEGREES', javascriptGenerator.ORDER_NONE) || 15;
  code += `target.util.direction += runtime.number(${degreesCode});\n`;
  return code;
};

javascriptGenerator['motion_turnleft'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const degreesCode = javascriptGenerator.valueToCode(block, 'DEGREES', javascriptGenerator.ORDER_NONE) || 15;
  code += `target.util.direction -= runtime.number(${degreesCode});\n`;
  return code;
};

javascriptGenerator['motion_pointindirection'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const directionCode = javascriptGenerator.valueToCode(block, 'DIRECTION', javascriptGenerator.ORDER_NONE) || 90;
  code += `target.util.direction = runtime.number(${directionCode});\n`;
  return code;
};

javascriptGenerator['motion_pointtowards_menu'] = (block) => {
  return [block.getFieldValue('TOWARDS'), javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['motion_pointtowards'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  let towardsCode = javascriptGenerator.valueToCode(block, 'TOWARDS', javascriptGenerator.ORDER_NONE);
  if (towardsCode === '_random_') {
    towardsCode = `runtime.random(1, 360)`;
  } else {
    towardsCode = `runtime.getSpriteByIdOrName('${towardsCode}').util`;
  }
  code += `target.util.towards(${towardsCode});\n`;
  return code;
};

javascriptGenerator['motion_gotoxy'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const xCode = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_NONE) || 0;
  const yCode = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_NONE) || 0;
  code += `target.util.goto(runtime.number(${xCode}), runtime.number(${yCode}));\n`;
  return code;
};

javascriptGenerator['motion_goto_menu'] = (block) => {
  return [block.getFieldValue('TO'), javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['motion_goto'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  let toCode = javascriptGenerator.valueToCode(block, 'TO', javascriptGenerator.ORDER_NONE) || '_random_';
  if (toCode === '_random_') {
    toCode = `{ x: runtime.random('width'), y: runtime.random('height') }`;
  } else {
    toCode = `runtime.getSpriteByIdOrName('${toCode}').util`;
  }
  code += `target.util.goto(${toCode});\n`;
  return code;
};

javascriptGenerator['motion_glidesecstoxy'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const secsCode = javascriptGenerator.valueToCode(block, 'SECS', javascriptGenerator.ORDER_NONE) || 1;
  const xCode = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_NONE) || 0;
  const yCode = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_NONE) || 0;
  code += `await target.util.glide(runtime.number(${secsCode}), runtime.number(${xCode}), runtime.number(${yCode}));\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['motion_glideto_menu'] = javascriptGenerator['motion_goto_menu'];

javascriptGenerator['motion_glideto'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  const secsCode = javascriptGenerator.valueToCode(block, 'SECS', javascriptGenerator.ORDER_NONE) || 1;
  let toCode = javascriptGenerator.valueToCode(block, 'TO', javascriptGenerator.ORDER_NONE) || '_random_';
  if (toCode === '_random_') {
    toCode = `{ x: runtime.random('width'), y: runtime.random('height') }`;
  } else {
    toCode = `runtime.getSpriteByIdOrName('${toCode}').util`;
  }
  code += `await target.util.glide(${secsCode}, ${toCode});\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['motion_changexby'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const dxCode = javascriptGenerator.valueToCode(block, 'DX', javascriptGenerator.ORDER_NONE) || 10;
  code += `target.util.x += runtime.number(${dxCode});\n`;
  return code;
};

javascriptGenerator['motion_setx'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const xCode = javascriptGenerator.valueToCode(block, 'X', javascriptGenerator.ORDER_NONE) || 0;
  code += `target.util.x = runtime.number(${xCode});\n`;
  return code;
};

javascriptGenerator['motion_changeyby'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const dyCode = javascriptGenerator.valueToCode(block, 'DY', javascriptGenerator.ORDER_NONE) || 10;
  code += `target.util.y += runtime.number(${dyCode});\n`;
  return code;
};

javascriptGenerator['motion_sety'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const yCode = javascriptGenerator.valueToCode(block, 'Y', javascriptGenerator.ORDER_NONE) || 0;
  code += `target.util.y = runtime.number(${yCode});\n`;
  return code;
};

javascriptGenerator['motion_ifonedgebounce'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  code += 'target.util.edgeBounce();\n';
  return code;
};

javascriptGenerator['motion_setrotationstyle'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
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

javascriptGenerator['motion_xposition'] = () => {
  return ['target.util.x', javascriptGenerator.ORDER_NONE];
};

javascriptGenerator['motion_yposition'] = () => {
  return ['target.util.y', javascriptGenerator.ORDER_NONE];
};

javascriptGenerator['motion_direction'] = () => {
  return ['target.util.direction', javascriptGenerator.ORDER_NONE];
};
