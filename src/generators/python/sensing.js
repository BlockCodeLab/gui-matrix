import { pythonGenerator } from './generator';

pythonGenerator['sensing_touchingobjectmenu'] = function (block) {
  return [block.getFieldValue('TOUCHINGOBJECTMENU'), this.ORDER_ATOMIC];
};

pythonGenerator['sensing_touchingobject_exact'] = function (block) {
  let touchingCode = this.valueToCode(block, 'TOUCHINGOBJECTMENU', this.ORDER_NONE) || '_edge_';
  if (touchingCode === '_edge_') {
    touchingCode = 'None';
  } else {
    touchingCode = `stage.get_child('${touchingCode}')`;
  }
  return [`target.is_touching(${touchingCode}, True)`, this.ORDER_FUNCTION_CALL];
};

pythonGenerator['sensing_touchingobject'] = function (block) {
  let touchingCode = this.valueToCode(block, 'TOUCHINGOBJECTMENU', this.ORDER_NONE) || '_edge_';
  if (touchingCode === '_edge_') {
    touchingCode = '';
  } else {
    touchingCode = `stage.get_child('${touchingCode}')`;
  }
  return [`target.is_touching(${touchingCode})`, this.ORDER_FUNCTION_CALL];
};

pythonGenerator['sensing_distancetomenu'] = function (block) {
  return [block.getFieldValue('DISTANCETOMENU'), this.ORDER_ATOMIC];
};

pythonGenerator['sensing_distanceto'] = function (block) {
  let distanceCode = this.valueToCode(block, 'DISTANCETOMENU', this.ORDER_NONE) || '_center_';
  if (distanceCode === '_center_') {
    distanceCode = '';
  } else {
    distanceCode = `stage.get_child('${distanceCode}')`;
  }
  return [`target.distance(${distanceCode})`, this.ORDER_FUNCTION_CALL];
};

pythonGenerator['sensing_keyoptions'] = function (block) {
  return [block.getFieldValue('KEY_OPTION'), this.ORDER_NONE];
};

pythonGenerator['sensing_keypressed'] = function (block) {
  const keyCode = this.valueToCode(block, 'KEY_OPTION', this.ORDER_NONE) || 'any';
  return [`runtime.is_pressed("${keyCode}")`, this.ORDER_MEMBER];
};

pythonGenerator['sensing_of_object_menu'] = function (block) {
  return [block.getFieldValue('OBJECT'), this.ORDER_MEMBER];
};

pythonGenerator['sensing_of'] = function (block) {
  let objectCode = this.valueToCode(block, 'OBJECT', this.ORDER_NONE) || '_stage_';
  if (objectCode === '_stage_') {
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
    default:
      objectCode += '.frame_number';
      break;
  }
  return [objectCode, this.ORDER_MEMBER];
};

pythonGenerator['sensing_joystick_x'] = () => '';

pythonGenerator['sensing_joystick_y'] = () => '';

pythonGenerator['sensing_loudness'] = () => '';
