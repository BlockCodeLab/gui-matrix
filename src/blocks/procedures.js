import { ScratchBlocks } from '@blockcode/blocks';

export default () => ({
  id: 'procedures',
  skipXML: true,
  blocks: [
    {
      id: 'definition',
      emu(block) {
        const myBlock = block.childBlocks_[0];
        const funcName = this.getVariableName(myBlock.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
        const args = myBlock.childBlocks_.map((argBlock) => this.getVariableName(argBlock.getFieldValue('VALUE')));
        let funcCode = this.HAT_CALLBACK;
        args.push('done');
        funcCode = funcCode.replace('(done) => {\n', `(target, ${args.join(', ')}) => {\n`);
        funcCode = funcCode.replace('= runtime.warpMode;\n', `= ${myBlock.warp_};\n`);
        return `runtime.define('procedure:${funcName}', ${funcCode});\n`;
      },
      mpy(block) {
        const myBlock = block.childBlocks_[0];
        const funcName = this.getVariableName(myBlock.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
        const args = myBlock.childBlocks_.map((argBlock) => this.getVariableName(argBlock.getFieldValue('VALUE')));
        const branchCode = this.eventToCode('procedure', myBlock.warp_ ? 'True' : 'False', ...args, 'target');
        return `@when_procedure("${funcName}")\n${branchCode}`;
      },
    },
    {
      id: 'call',
      emu(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        const funcName = this.getVariableName(block.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
        const args = block.argumentIds_.map((arg) => this.valueToCode(block, arg, this.ORDER_NONE));
        args.unshift('target');
        code += `await runtime.call('procedure:${funcName}', ${args.join(', ')})\n`;
        return code;
      },
      mpy(block) {
        const funcName = this.getVariableName(block.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
        const args = block.argumentIds_.map((arg) => this.valueToCode(block, arg, this.ORDER_NONE));
        const argsCode = args.length > 0 ? `, ${args.join(', ')}` : '';
        return `await runtime.procedure_call("${funcName}"${argsCode}, target)\n`;
      },
    },
  ],
});
