import { ArcademuGenerator } from './generator';

const proto = ArcademuGenerator.prototype;

proto['event_whenkeypressed'] = function (block) {
  const keyValue = block.getFieldValue('KEY_OPTION');
  return `runtime.when('keypressed:${keyValue}', ${this.TARGET_HAT_CALLBACK}, target);\n`;
};

proto['event_whenbackdropswitchesto'] = function (block) {
  const backdropValue = block.getFieldValue('BACKDROP');
  return `runtime.when('backdropswitchesto:${backdropValue}', ${this.TARGET_HAT_CALLBACK}, target);\n`;
};

proto['event_whenbroadcastreceived'] = function (block) {
  const messageName = this.getVariableName(block.getFieldValue('BROADCAST_OPTION'));
  return `runtime.when('message:${messageName}', ${this.TARGET_HAT_CALLBACK}}, target);\n`;
};
