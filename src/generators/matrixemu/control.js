import { MatrixemuGenerator } from './generator';

const proto = MatrixemuGenerator.prototype;

proto['control_start_as_clone'] = function () {
  return `runtime.whenCloneStart(target, ${this.TARGET_HAT_CALLBACK});\n`;
};

proto['control_create_clone_of_menu'] = function (block) {
  return [block.getFieldValue('CLONE_OPTION'), this.ORDER_FUNCTION_CALL];
};

proto['control_create_clone_of'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  let cloneCode = this.valueToCode(block, 'CLONE_OPTION', this.ORDER_NONE) || '_myself_';
  if (cloneCode === '_myself_') {
    cloneCode = 'target';
  } else {
    cloneCode = this.quote_(cloneCode);
  }
  code += `targetUtils.clone(${cloneCode});\n`;
  return code;
};

proto['control_delete_this_clone'] = function () {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `if (target.hasName('clone')) target.destroy();\n`;
  return code;
};
