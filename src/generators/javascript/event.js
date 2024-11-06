import { ScratchBlocks } from '@blockcode/blocks-editor';
import { javascriptGenerator } from './generator';

const EVENT_CALLBACK = `async (target, done) => {\ndo {\n/* code */} while (false);\ndone();\n}`;

javascriptGenerator['event_whenkeypressed'] = function (block) {
  const keyValue = block.getFieldValue('KEY_OPTION');
  return `runtime.when('keypressed:${keyValue}', ${EVENT_CALLBACK}, target);\n`;
};

javascriptGenerator['event_whenbackdropswitchesto'] = function (block) {
  const backdropValue = block.getFieldValue('BACKDROP');
  return `runtime.when('backdropswitchesto:${backdropValue}', ${EVENT_CALLBACK}, target);\n`;
};

javascriptGenerator['event_whenbroadcastreceived'] = function (block) {
  const messageName = this.variableDB_.getName(
    block.getFieldValue('BROADCAST_OPTION'),
    ScratchBlocks.Variables.NAME_TYPE,
  );
  return `runtime.when('message:${messageName}', ${EVENT_CALLBACK}, target);\n`;
};
