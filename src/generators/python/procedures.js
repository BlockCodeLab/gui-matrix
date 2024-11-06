import { ScratchBlocks } from '@blockcode/blocks-editor';
import { pythonGenerator } from './generator';

pythonGenerator['procedures_definition'] = function (block) {
  const myBlock = block.childBlocks_[0];
  const functionName = this.variableDB_.getName(myBlock.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
  const args = myBlock.childBlocks_.map((argBlock) =>
    this.variableDB_.getName(argBlock.getFieldValue('VALUE'), ScratchBlocks.Variables.NAME_TYPE),
  );
  args.push('target');
  return this.functionToCode(functionName, args);
};

pythonGenerator['procedures_call'] = function (block) {
  const functionName = this.variableDB_.getName(block.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
  const args = block.argumentIds_.map((arg) => this.valueToCode(block, arg, this.ORDER_NONE));
  args.push('target');
  return `await ${functionName}(${args.join(',')})\n`;
};
