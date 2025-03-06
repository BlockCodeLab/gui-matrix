export default () => ({
  id: 'control',
  skipXML: true,
  blocks: [
    {
      id: 'start_as_clone',
      emu(block) {
        return `runtime.whenCloneStart(target, ${this.TARGET_HAT_CALLBACK});\n`;
      },
    },
    {
      id: 'create_clone_of',
      emu(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        let cloneCode = this.valueToCode(block, 'CLONE_OPTION', this.ORDER_NONE);
        if (cloneCode === '_myself_') {
          cloneCode = 'target';
        }
        code += `targetUtils.clone(${cloneCode});\n`;
        return code;
      },
    },
    {
      id: 'delete_this_clone',
      emu(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        code += `targetUtils.removeClone(target);\n`;
        return code;
      },
    },
  ],
});
