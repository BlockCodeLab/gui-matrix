import { ScratchBlocks } from '@blockcode/blocks-editor';
import { pythonGenerator } from './generator';

pythonGenerator['procedures_definition'] = (block) => {
  const myBlock = block.childBlocks_[0];
  const functionName = pythonGenerator.variableDB_.getName(myBlock.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
  const args = myBlock.childBlocks_.map((argBlock) =>
    pythonGenerator.variableDB_.getName(argBlock.getFieldValue('VALUE'), ScratchBlocks.Variables.NAME_TYPE),
  );
  args.push('target');
  return pythonGenerator.functionToCode(functionName, args);
};

pythonGenerator['procedures_call'] = (block) => {
  const functionName = pythonGenerator.variableDB_.getName(block.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
  const args = block.argumentIds_.map((arg) => pythonGenerator.valueToCode(block, arg, pythonGenerator.ORDER_NONE));
  args.push('target');
  return `await ${functionName}(${args.join(',')})\n`;
};
