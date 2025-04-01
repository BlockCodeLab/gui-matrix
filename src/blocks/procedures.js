export default () => ({
  id: 'procedures',
  skipXML: true,
  blocks: [
    {
      id: 'definition',
      emu(block) {
        const myBlock = block.childBlocks_[0];
        const funcName = this.getFunctionName(myBlock.getProcCode());
        const args = myBlock.childBlocks_.map((argBlock) => this.getVariableName(argBlock.getFieldValue('VALUE')));
        const argsCode = args.length > 0 ? `${args.join(', ')}, done` : 'done';

        let branchCode = this.statementToCode(block);
        branchCode = this.addEventTrap(branchCode, block.id)
          .replace('(done) => {\n', `(target, ${argsCode}) => {\n`)
          .replace('= runtime.warpMode;\n', `= ${myBlock.warp_};\n`);

        const code = `runtime.define('procedure:${funcName}', ${branchCode});\n`;
        return code;
      },
    },
    {
      id: 'call',
      emu(block) {
        const funcName = this.getFunctionName(block.getProcCode());
        const args = block.argumentIds_.map((arg) => this.valueToCode(block, arg, this.ORDER_NONE) || 'false');
        const argsCode = args.length > 0 ? `target, ${args.join(', ')}` : 'target';
        const code = `await runtime.call('procedure:${funcName}', ${argsCode})\n`;
        return code;
      },
    },
  ],
});
