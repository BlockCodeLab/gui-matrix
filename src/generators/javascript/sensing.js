import { javascriptGenerator } from './generator';

javascriptGenerator['sensing_touchingobjectmenu'] = function (block) {
  return [block.getFieldValue('TOUCHINGOBJECTMENU'), this.ORDER_ATOMIC];
};

javascriptGenerator['sensing_touchingobject_exact'] = function (block) {
  let touchingCode = this.valueToCode(block, 'TOUCHINGOBJECTMENU', this.ORDER_NONE) || '_edge_';
  if (touchingCode === '_edge_') {
    touchingCode = 'null';
  } else {
    touchingCode = `runtime.getSpriteByIdOrName('${touchingCode}').util`;
  }
  return [`target.util.isTouching(${touchingCode}, true)`, this.ORDER_FUNCTION_CALL];
};

javascriptGenerator['sensing_touchingobject'] = function (block) {
  let touchingCode = this.valueToCode(block, 'TOUCHINGOBJECTMENU', this.ORDER_NONE) || '_edge_';
  if (touchingCode === '_edge_') {
    touchingCode = '';
  } else {
    touchingCode = `runtime.getSpriteByIdOrName('${touchingCode}').util`;
  }
  return [`target.util.isTouching(${touchingCode})`, this.ORDER_FUNCTION_CALL];
};

javascriptGenerator['sensing_distancetomenu'] = function (block) {
  return [block.getFieldValue('DISTANCETOMENU'), this.ORDER_ATOMIC];
};

javascriptGenerator['sensing_distanceto'] = function (block) {
  let distanceCode = this.valueToCode(block, 'DISTANCETOMENU', this.ORDER_NONE) || '_center_';
  if (distanceCode === '_center_') {
    distanceCode = '';
  } else {
    distanceCode = `runtime.getSpriteByIdOrName('${distanceCode}').util`;
  }
  return [`target.util.distanceTo(${distanceCode})`, this.ORDER_FUNCTION_CALL];
};

javascriptGenerator['sensing_keyoptions'] = function (block) {
  return [block.getFieldValue('KEY_OPTION'), this.ORDER_NONE];
};

javascriptGenerator['sensing_keypressed'] = function (block) {
  const keyCode = this.valueToCode(block, 'KEY_OPTION', this.ORDER_NONE) || 'any';
  return [`runtime.${keyCode}Key`, this.ORDER_MEMBER];
};

javascriptGenerator['sensing_of_object_menu'] = function (block) {
  return [block.getFieldValue('OBJECT'), this.ORDER_ATOMIC];
};

javascriptGenerator['sensing_of'] = function (block) {
  let objectCode = this.valueToCode(block, 'OBJECT', this.ORDER_NONE) || '_stage_';
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
    default:
      objectCode += objectCode === `runtime.stage.util` ? '.costume' : '.backdrop';
      break;
  }
  return [objectCode, this.ORDER_MEMBER];
};

javascriptGenerator['sensing_joystick_x'] = () => '';

javascriptGenerator['sensing_joystick_y'] = () => '';

javascriptGenerator['sensing_loudness'] = () => '';
