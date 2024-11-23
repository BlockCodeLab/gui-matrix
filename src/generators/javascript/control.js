import { javascriptGenerator } from './generator';

javascriptGenerator['control_start_as_clone'] = function () {
  return `runtime.whenCloneStart(target, ${this.TARGET_EVENT_CALLBACK});\n`;
};

javascriptGenerator['control_create_clone_of_menu'] = function (block) {
  return [block.getFieldValue('CLONE_OPTION'), this.ORDER_FUNCTION_CALL];
};

javascriptGenerator['control_create_clone_of'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  let cloneCode = this.valueToCode(block, 'CLONE_OPTION', this.ORDER_NONE) || '_myself_';
  if (cloneCode === '_myself_') {
    cloneCode = 'target';
  } else {
    cloneCode = `runtime.getSpriteByIdOrName('${cloneCode}')`;
  }
  code += `${cloneCode}.util.clone();\n`;
  return code;
};

javascriptGenerator['control_delete_this_clone'] = function () {
  return 'target.util.remove();\n';
};
