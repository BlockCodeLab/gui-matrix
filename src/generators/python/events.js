import { ScratchBlocks } from '@blockcode/blocks-editor';
import { pythonGenerator } from './generator';

pythonGenerator['event_whenkeypressed'] = (block) => {
  const keyValue = block.getFieldValue('KEY_OPTION');
  const branchCode = pythonGenerator.eventToCode('keypressed', 'target');
  return `runtime.when_keypressed("${keyValue}", target)\n${branchCode}`;
};

pythonGenerator['event_whenbackdropswitchesto'] = (block) => {
  const backdropValue = block.getFieldValue('BACKDROP');
  const branchCode = pythonGenerator.eventToCode('backdropswitchesto', 'target');
  return `@runtime.when_backdropswitchesto("${backdropValue}", target)\n${branchCode}`;
};

pythonGenerator['event_whenbroadcastreceived'] = (block) => {
  const messageName = pythonGenerator.variableDB_.getName(
    block.getFieldValue('BROADCAST_OPTION'),
    ScratchBlocks.Variables.NAME_TYPE,
  );
  const branchCode = pythonGenerator.eventToCode('broadcastreceived', 'target');
  return `@when_broadcastreceived("${messageName}", target)\n${branchCode}`;
};
