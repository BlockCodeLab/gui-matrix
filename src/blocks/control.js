export default () => ({
  id: 'control',
  skipXML: true,
  blocks: [
    {
      id: 'wait',
      mpy(block) {
        const durationCode = this.valueToCode(block, 'DURATION', this.ORDER_NONE);
        const code = `await runtime.wait_for(${durationCode})\n`;
        return code;
      },
    },
    {
      id: 'stop',
      mpy(block) {
        let code = '';
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
        let branchCode = this.statementToCode(block);
        branchCode = this.addEventTrap(branchCode, block.id);
        branchCode = branchCode.replace('(done) => {\n', '(target, done) => {\n');
        const code = `runtime.whenCloneStart(target, ${branchCode});\n`;
        return code;
      },
      mpy(block) {
        let branchCode = this.statementToCode(block);
        branchCode = this.addEventTrap(branchCode, block.id);
        branchCode = branchCode.replace('():\n', '(target):\n');

        let code = '';
        code += '@when_startasclone(target.id)\n';
        code += branchCode;
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
        const code = `targetUtils.clone(${cloneCode});\n`;
        return code;
      },
      mpy(block) {
        let cloneCode = this.valueToCode(block, 'CLONE_OPTION', this.ORDER_NONE);
        if (cloneCode === '_myself_') {
          cloneCode = 'target';
        } else {
          cloneCode = `stage.get_child(${cloneCode})`;
        }
        const code = `${cloneCode}.clone()\n`;
        return code;
      },
    },
    {
      id: 'delete_this_clone',
      emu(block) {
        const code = `targetUtils.removeClone(target);\n`;
        return code;
      },
      mpy(block) {
        const code = 'target.remove()\n';
        return code;
      },
    },
  ],
});
