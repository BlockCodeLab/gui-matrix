import { ScratchBlocks } from '@blockcode/blocks';
import { ArcadepyGenerator } from './generator';

const proto = ArcadepyGenerator.prototype;

proto['procedures_definition'] = function (block) {
  const myBlock = block.childBlocks_[0];
  const funcName = this.getVariableName(myBlock.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
  const args = myBlock.childBlocks_.map((argBlock) => this.getVariableName(argBlock.getFieldValue('VALUE')));
  const branchCode = this.eventToCode('procedure', myBlock.warp_ ? 'True' : 'False', ...args, 'target');
  return `@when_procedure("${funcName}")\n${branchCode}`;
};

proto['procedures_call'] = function (block) {
  const funcName = this.getVariableName(block.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
  const args = block.argumentIds_.map((arg) => this.valueToCode(block, arg, this.ORDER_NONE));
  const argsCode = args.length > 0 ? `, ${args.join(', ')}` : '';
  return `await runtime.procedure_call("${funcName}"${argsCode}, target)\n`;
};
