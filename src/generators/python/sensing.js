import { pythonGenerator } from '@blockcode/workspace-blocks/app';

pythonGenerator['sensing_touchingobjectmenu'] = (block) => {
  return [block.getFieldValue('TOUCHINGOBJECTMENU'), pythonGenerator.ORDER_ATOMIC];
};

pythonGenerator['sensing_touchingobject_exact'] = (block) => {
  let touchingCode = pythonGenerator.valueToCode(block, 'TOUCHINGOBJECTMENU', pythonGenerator.ORDER_NONE) || '_edge_';
  if (touchingCode === '_edge_') {
    touchingCode = 'None';
  } else {
    touchingCode = `stage.get_child('${touchingCode}')`;
  }
  return [`target.is_touching(${touchingCode}, True)`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator['sensing_touchingobject'] = (block) => {
  let touchingCode = pythonGenerator.valueToCode(block, 'TOUCHINGOBJECTMENU', pythonGenerator.ORDER_NONE) || '_edge_';
  if (touchingCode === '_edge_') {
    touchingCode = '';
  } else {
    touchingCode = `stage.get_child('${touchingCode}')`;
  }
  return [`target.is_touching(${touchingCode})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator['sensing_distancetomenu'] = (block) => {
  return [block.getFieldValue('DISTANCETOMENU'), pythonGenerator.ORDER_ATOMIC];
};

pythonGenerator['sensing_distanceto'] = (block) => {
  let distanceCode = pythonGenerator.valueToCode(block, 'DISTANCETOMENU', pythonGenerator.ORDER_NONE) || '_center_';
  if (distanceCode === '_center_') {
    distanceCode = '';
  } else {
    distanceCode = `stage.get_child('${distanceCode}')`;
  }
  return [`target.distance(${distanceCode})`, pythonGenerator.ORDER_FUNCTION_CALL];
};

pythonGenerator['sensing_keyoptions'] = (block) => {
  return [block.getFieldValue('KEY_OPTION'), pythonGenerator.ORDER_NONE];
};

pythonGenerator['sensing_keypressed'] = (block) => {
  const keyCode = pythonGenerator.valueToCode(block, 'KEY_OPTION', pythonGenerator.ORDER_NONE) || 'any';
  return [`buttons.${keyCode}.pressed`, pythonGenerator.ORDER_MEMBER];
};

pythonGenerator['sensing_of_object_menu'] = (block) => {
  return [block.getFieldValue('OBJECT'), pythonGenerator.ORDER_MEMBER];
};

pythonGenerator['sensing_of'] = (block) => {
  let objectCode = pythonGenerator.valueToCode(block, 'OBJECT', pythonGenerator.ORDER_NONE) || '_stage_';
  if (object === '_stage_') {
    objectCode = `stage`;
  } else {
    objectCode = `stage.get_child('${objectCode}')`;
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
  }
  return [objectCode, pythonGenerator.ORDER_MEMBER];
};
