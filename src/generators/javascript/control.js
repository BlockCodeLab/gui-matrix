import { javascriptGenerator } from './generator';

const EVENT_CALLBACK = `async (target, done) => {\ndo {\n/* code */} while (false);\ndone();\n}`;

javascriptGenerator['control_start_as_clone'] = () => {
  return `runtime.whenCloneStart(target, ${EVENT_CALLBACK});\n`;
};

javascriptGenerator['control_create_clone_of_menu'] = (block) => {
  return [block.getFieldValue('CLONE_OPTION'), javascriptGenerator.ORDER_FUNCTION_CALL];
};

javascriptGenerator['control_create_clone_of'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  let cloneCode = javascriptGenerator.valueToCode(block, 'CLONE_OPTION', javascriptGenerator.ORDER_NONE) || '_myself_';
  if (cloneCode === '_myself_') {
    cloneCode = 'target';
  } else {
    cloneCode = `runtime.getSpriteByIdOrName('${cloneCode}')`;
  }
  code += `${cloneCode}.util.clone();\n`;
  return code;
};

javascriptGenerator['control_delete_this_clone'] = () => {
  return 'target.util.remove();\n';
};

javascriptGenerator['control_stop'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  const stopValue = block.getFieldValue('STOP_OPTION');
  switch (stopValue) {
    case 'all':
      code += 'runtime.stop();\n';
      break;
    case 'this script':
      code += 'return done();\n';
      break;
    case 'other scripts in sprite':
      code += 'abort = true;\n';
      break;
  }
  return code;
};
