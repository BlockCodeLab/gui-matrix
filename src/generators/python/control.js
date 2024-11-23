import { pythonGenerator } from './generator';

pythonGenerator['control_start_as_clone'] = function () {
  const branchCode = this.eventToCode('startasclone', 'False', 'target');
  return `@when_startasclone(target.id)\n${branchCode}`;
};

pythonGenerator['control_create_clone_of_menu'] = function (block) {
  return [block.getFieldValue('CLONE_OPTION'), this.ORDER_FUNCTION_CALL];
};

pythonGenerator['control_create_clone_of'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  let cloneCode = this.valueToCode(block, 'CLONE_OPTION', this.ORDER_NONE) || '_myself_';
  if (cloneCode === '_myself_') {
    cloneCode = 'target';
  } else {
    cloneCode = `stage.get_child("${cloneCode}")`;
  }
  code += `${cloneCode}.clone()\n`;
  return code;
};

pythonGenerator['control_delete_this_clone'] = function () {
  return 'target.remove()\n';
};
