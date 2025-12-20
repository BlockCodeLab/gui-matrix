export default () => ({
  id: 'control',
  skipXML: true,
  blocks: [
    {
      id: 'start_as_clone',
      emu(block) {
        let branchCode = this.statementToCode(block);
        branchCode = this.addEventTrap(branchCode, block.id);
        branchCode = branchCode.replace('(done) => {\n', '(target, done) => {\n');
        const code = `runtime.whenCloneStart(target, ${branchCode});\n`;
        return code;
      },
    },
    {
      id: 'create_clone_of',
      emu(block) {
        let cloneCode = this.valueToCode(block, 'CLONE_OPTION', this.ORDER_NONE);
        if (cloneCode === '_myself_') {
          cloneCode = 'target';
        }
        const code = `targetUtils.clone(userscript, ${cloneCode});\n`;
        this.renderLoopTrap();
        return code;
      },
    },
    {
      id: 'delete_this_clone',
      emu(block) {
        let code = '';
        code += 'targetUtils.removeClone(userscript);\n';
        code += 'return;\n';
        this.renderLoopTrap();
        return code;
      },
    },
  ],
});
