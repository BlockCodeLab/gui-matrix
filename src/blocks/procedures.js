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
          .replace('= runtime.warpMode;\n', `= ${myBlock.warp_} || runtime.warpMode;\n`);

        const code = `runtime.onEvent('procedure:${funcName}', ${branchCode});\n`;
        return code;
      },
      mpy(block) {
        const myBlock = block.childBlocks_[0];
        const funcName = this.getFunctionName(myBlock.getProcCode());
        const args = myBlock.childBlocks_.map((argBlock) => this.getVariableName(argBlock.getFieldValue('VALUE')));
        const argsCode = args.length > 0 ? `${args.join(', ')}, target` : 'target';

        let branchCode = this.statementToCode(block);
        branchCode = this.addEventTrap(branchCode, block.id)
          .replace('():\n', `(${argsCode}):\n`)
          .replace('= runtime.warp_mode\n', `= ${myBlock.warp_ ? 'True' : 'False'}\n`);

        let code = '';
        code += `@when_procedure("${funcName}")\n`;
        code += branchCode;
        return code;
      },
    },
    {
      id: 'call',
      emu(block) {
        const funcName = this.getFunctionName(block.getProcCode());
        const args = block.argumentIds_.map((arg) => this.valueToCode(block, arg, this.ORDER_NONE) || 'false');
        const argsCode = args.length > 0 ? `target, ${args.join(', ')}` : 'target';
        const code = `await runtime.emitEvent('procedure:${funcName}', ${argsCode})\n`;
        if (!block.warp_) {
          this._guardLoop = this.GUARD_LOOP_DISABLE;
        }
        return code;
      },
      mpy(block) {
        const funcName = this.getFunctionName(block.getProcCode());
        const args = block.argumentIds_.map((arg) => this.valueToCode(block, arg, this.ORDER_NONE) || 'False');
        const argsCode = args.length > 0 ? `${args.join(', ')}, target` : 'target';
        const code = `await runtime.procedure_call("${funcName}", ${argsCode})\n`;
        return code;
      },
    },
  ],
});
