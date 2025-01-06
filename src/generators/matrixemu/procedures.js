import { ScratchBlocks } from '@blockcode/blocks';
import { MatrixemuGenerator } from './generator';

const proto = MatrixemuGenerator.prototype;

proto['procedures_definition'] = function (block) {
  const myBlock = block.childBlocks_[0];
  const funcName = this.nameDB_.getName(myBlock.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
  const args = myBlock.childBlocks_.map((argBlock) => this.getVariableName(argBlock.getFieldValue('VALUE')));
  args.push('done');

  let funcCode = this.HAT_CALLBACK;
  funcCode = funcCode.replace('(done) => {\n', `(target, ${args.join(', ')}) => {\n`);
  funcCode = funcCode.replace('= runtime.warpMode;\n', `= ${myBlock.warp_};\n`);
  return `runtime.on('procedure:${funcName}', ${funcCode});\n`;
};

proto['procedures_call'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const funcName = this.nameDB_.getName(block.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
  const args = block.argumentIds_.map((arg) => this.valueToCode(block, arg, this.ORDER_NONE));
  args.unshift('target');

  code += `await runtime.emit('procedure:${funcName}', ${args.join(', ')})\n`;
  return code;
};
