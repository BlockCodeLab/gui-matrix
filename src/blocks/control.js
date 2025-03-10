export default () => ({
  id: 'control',
  skipXML: true,
  blocks: [
    {
      id: 'wait',
      mpy(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        const durationCode = this.valueToCode(block, 'DURATION', this.ORDER_NONE) || 0;
        code += `await runtime.wait_for(${durationCode})\n`;
        return code;
      },
    },
    {
      id: 'stop',
      mpy(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        const stopValue = block.getFieldValue('STOP_OPTION');
        switch (stopValue) {
          case 'all':
            code += 'runtime.stop()\n';
            break;
          case 'this script':
            code += 'return\n';
            break;
          case 'other scripts in sprite':
            code += 'runtime.abort(func_id)\n';
            break;
        }
        return code;
      },
    },
    {
      id: 'start_as_clone',
      emu(block) {
        return `runtime.whenCloneStart(target, ${this.TARGET_HAT_CALLBACK});\n`;
      },
      mpy(block) {
        const branchCode = this.eventToCode('startasclone', 'runtime.flash_mode', 'target');
        return `@when_startasclone(target.id)\n${branchCode}`;
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
      mpy(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        let cloneCode = this.valueToCode(block, 'CLONE_OPTION', this.ORDER_NONE);
        if (cloneCode === '_myself_') {
          cloneCode = 'target';
        } else {
          cloneCode = `stage.get_child(${cloneCode})`;
        }
        code += `${cloneCode}.clone()\n`;
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
      mpy(block) {
        let code = '';
        if (this.STATEMENT_PREFIX) {
          code += this.injectId(this.STATEMENT_PREFIX, block);
        }
        code += 'target.remove()\n';
        return code;
      },
    },
  ],
});
