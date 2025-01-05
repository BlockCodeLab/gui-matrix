import { ArcadepyGenerator } from './generator';

const proto = ArcadepyGenerator.prototype;

proto['event_whenkeypressed'] = function (block) {
  const keyValue = block.getFieldValue('KEY_OPTION');
  const branchCode = this.eventToCode('keypressed', 'runtime.flash_mode', 'target');
  return `@when_keypressed("${keyValue}", target)\n${branchCode}`;
};

proto['event_whenbackdropswitchesto'] = function (block) {
  const backdropValue = block.getFieldValue('BACKDROP');
  const branchCode = this.eventToCode('backdropswitchesto', 'runtime.flash_mode', 'target');
  return `@when_backdropswitchesto("${backdropValue}", target)\n${branchCode}`;
};

proto['event_whenbroadcastreceived'] = function (block) {
  const messageName = this.getVariableName(block.getFieldValue('BROADCAST_OPTION'));
  const branchCode = this.eventToCode('broadcastreceived', 'runtime.flash_mode', 'target');
  return `@when_broadcastreceived("${messageName}", target)\n${branchCode}`;
};
