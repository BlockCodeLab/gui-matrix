import { javascriptGenerator } from '@blockcode/blocks-player';

javascriptGenerator['sensing_touchingobjectmenu'] = (block) => {
  return [block.getFieldValue('TOUCHINGOBJECTMENU'), javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['sensing_touchingobject_exact'] = (block) => {
  let touchingCode =
    javascriptGenerator.valueToCode(block, 'TOUCHINGOBJECTMENU', javascriptGenerator.ORDER_NONE) || '_edge_';
  if (touchingCode === '_edge_') {
    touchingCode = 'null';
  } else {
    touchingCode = `runtime.getSpriteByIdOrName('${touchingCode}').util`;
  }
  return [`target.util.isTouching(${touchingCode}, true)`, javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator['sensing_touchingobject'] = (block) => {
  let touchingCode =
    javascriptGenerator.valueToCode(block, 'TOUCHINGOBJECTMENU', javascriptGenerator.ORDER_NONE) || '_edge_';
  if (touchingCode === '_edge_') {
    touchingCode = '';
  } else {
    touchingCode = `runtime.getSpriteByIdOrName('${touchingCode}').util`;
  }
  return [`target.util.isTouching(${touchingCode})`, javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator['sensing_distancetomenu'] = (block) => {
  return [block.getFieldValue('DISTANCETOMENU'), javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['sensing_distanceto'] = (block) => {
  let distanceCode =
    javascriptGenerator.valueToCode(block, 'DISTANCETOMENU', javascriptGenerator.ORDER_NONE) || '_center_';
  if (distanceCode === '_center_') {
    distanceCode = '';
  } else {
    distanceCode = `runtime.getSpriteByIdOrName('${distanceCode}').util`;
  }
  return [`target.util.distanceTo(${distanceCode})`, javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator['sensing_keyoptions'] = (block) => {
  return [block.getFieldValue('KEY_OPTION'), javascriptGenerator.ORDER_NONE];
};

javascriptGenerator['sensing_keypressed'] = (block) => {
  const keyCode = javascriptGenerator.valueToCode(block, 'KEY_OPTION', javascriptGenerator.ORDER_NONE) || 'any';
  return [`runtime.${keyCode}Key`, javascriptGenerator.ORDER_MEMBER];
};

javascriptGenerator['sensing_of_object_menu'] = (block) => {
  return [block.getFieldValue('OBJECT'), javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['sensing_of'] = (block) => {
  let objectCode = javascriptGenerator.valueToCode(block, 'OBJECT', javascriptGenerator.ORDER_NONE) || '_stage_';
  if (objectCode === '_stage_') {
    objectCode = `runtime.stage.util`;
  } else {
    objectCode = `runtime.getSpriteByIdOrName('${objectCode}').util`;
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
      objectCode += '.costume';
      break;
    case 'costume name':
      objectCode += '.costumeName';
      break;
    case 'size':
      objectCode += '.size';
      break;
    case 'backdrop #':
      objectCode += '.backdrop';
      break;
    case 'backdrop name':
      objectCode += '.backdropName';
      break;
  }
  return [objectCode, javascriptGenerator.ORDER_MEMBER];
};
