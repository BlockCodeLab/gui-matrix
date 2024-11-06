import { ScratchBlocks } from '@blockcode/blocks-editor';
import { pythonGenerator } from './generator';

pythonGenerator['event_whenkeypressed'] = function (block) {
  const keyValue = block.getFieldValue('KEY_OPTION');
  const branchCode = this.eventToCode('keypressed', 'target');
  return `@when_keypressed("${keyValue}", target)\n${branchCode}`;
};

pythonGenerator['event_whenbackdropswitchesto'] = function (block) {
  const backdropValue = block.getFieldValue('BACKDROP');
  const branchCode = this.eventToCode('backdropswitchesto', 'target');
  return `@when_backdropswitchesto("${backdropValue}", target)\n${branchCode}`;
};

pythonGenerator['event_whenbroadcastreceived'] = function (block) {
  const messageName = this.variableDB_.getName(
    block.getFieldValue('BROADCAST_OPTION'),
    ScratchBlocks.Variables.NAME_TYPE,
  );
  const branchCode = this.eventToCode('broadcastreceived', 'target');
  return `@when_broadcastreceived("${messageName}", target)\n${branchCode}`;
};
