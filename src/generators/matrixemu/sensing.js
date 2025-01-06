import { MatrixemuGenerator } from './generator';

const proto = MatrixemuGenerator.prototype;

proto['sensing_touchingobjectmenu'] = function (block) {
  return [this.quote_(block.getFieldValue('TOUCHINGOBJECTMENU')), this.ORDER_ATOMIC];
};

proto['sensing_touchingobject'] = function (block) {
  const touchingCode = this.valueToCode(block, 'TOUCHINGOBJECTMENU', this.ORDER_NONE) || `'_edge_'`;
  return [`runtime.isTouching(target, ${touchingCode})`, this.ORDER_FUNCTION_CALL];
};

// TODO: 角色轮廓碰撞
proto['sensing_touchingobject_exact'] = proto['sensing_touchingobject'];

proto['sensing_distancetomenu'] = function (block) {
  return [this.quote_(block.getFieldValue('DISTANCETOMENU')), this.ORDER_ATOMIC];
};

proto['sensing_distanceto'] = function (block) {
  const distanceCode = this.valueToCode(block, 'DISTANCETOMENU', this.ORDER_NONE) || `'_center_'`;
  return [`runtime.distanceTo(target, ${distanceCode})`, this.ORDER_FUNCTION_CALL];
};

proto['sensing_keyoptions'] = function (block) {
  return [block.getFieldValue('KEY_OPTION'), this.ORDER_NONE];
};

proto['sensing_keypressed'] = function (block) {
  const keyCode = this.valueToCode(block, 'KEY_OPTION', this.ORDER_NONE) || 'any';
  return [`runtime.${keyCode}Key`, this.ORDER_MEMBER];
};

proto['sensing_of_object_menu'] = function (block) {
  return [this.quote_(block.getFieldValue('OBJECT')), this.ORDER_ATOMIC];
};

proto['sensing_of'] = function (block) {
  const objectCode = this.valueToCode(block, 'OBJECT', this.ORDER_NONE) || `'_stage_'`;

  let propCode;
  switch (block.getFieldValue('PROPERTY')) {
    case 'x position':
      propCode = 'x';
      break;
    case 'y position':
      propCode = 'y';
      break;
    case 'direction':
      propCode = 'direction';
      break;
    case 'costume #':
      propCode = 'frameSerial';
      break;
    case 'costume name':
      propCode = 'frameName';
      break;
    case 'size':
      propCode = 'scaleSize';
      break;
    case 'backdrop #':
      propCode = 'frameSerial';
      break;
    case 'backdrop name':
      propCode = 'frameName';
      break;
    default:
      propCode = 'frameSerial';
      break;
  }
  return [`runtime.sensingOf(${objectCode}, '${propCode}')`, this.ORDER_MEMBER];
};

proto['sensing_joystick_x'] = function () {
  return ['runtime.joystick.x', this.ORDER_MEMBER];
};

proto['sensing_joystick_y'] = function () {
  return ['runtime.joystick.y', this.ORDER_MEMBER];
};

proto['sensing_loudness'] = () => '';
