import { ScratchBlocks } from '@blockcode/blocks-editor';
import { javascriptGenerator } from './generator';

const TARGET_VARIABLE = 'target.util.variable.';

javascriptGenerator['data_variable'] = function (block) {
  const varName =
    TARGET_VARIABLE + this.variableDB_.getName(block.getFieldValue('VARIABLE'), ScratchBlocks.Variables.NAME_TYPE);
  return [varName, this.ORDER_CONDITIONAL];
};

javascriptGenerator['data_setvariableto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const varName =
    TARGET_VARIABLE + this.variableDB_.getName(block.getFieldValue('VARIABLE'), ScratchBlocks.Variables.NAME_TYPE);
  const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || '""';
  code += `${varName} = ${valueCode};\n`;
  return code;
};

javascriptGenerator['data_changevariableby'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const varName =
    TARGET_VARIABLE + this.variableDB_.getName(block.getFieldValue('VARIABLE'), ScratchBlocks.Variables.NAME_TYPE);
  const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || 0;
  code += `${varName} = runtime.number(${varName}) + runtime.number(${valueCode});\n`;
  return code;
};

javascriptGenerator['data_listcontents'] = function (block) {
  const listName =
    TARGET_VARIABLE +
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  return [listName, this.ORDER_ATOMIC];
};

javascriptGenerator['data_addtolist'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const listName =
    TARGET_VARIABLE +
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
  code += `${listName}.push(${itemValue});\n`;
  return code;
};

javascriptGenerator['data_deleteoflist'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const listName =
    TARGET_VARIABLE +
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const indexCode = this.valueToCode(block, 'INDEX', this.ORDER_NONE) || 1;
  code += `${listName}.splice(runtime.index(${indexCode}, ${listName}.length), 1);\n`;
  return code;
};

javascriptGenerator['data_deletealloflist'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const listName =
    TARGET_VARIABLE +
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  code += `${listName}.length = 0;\n`;
  return code;
};

javascriptGenerator['data_insertatlist'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const listName =
    TARGET_VARIABLE +
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const indexCode = this.valueToCode(block, 'INDEX', this.ORDER_NONE) || 1;
  const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
  code += `${listName}.splice(runtime.index(${indexCode}, ${listName}.length), 0, ${itemValue});\n`;
  return code;
};

javascriptGenerator['data_replaceitemoflist'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const listName =
    TARGET_VARIABLE +
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const indexCode = this.valueToCode(block, 'INDEX', this.ORDER_NONE) || 1;
  const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
  code += `${listName}[runtime.index(${indexCode}, ${listName}.length)] = ${itemValue};\n`;
  return code;
};

javascriptGenerator['data_itemoflist'] = function (block) {
  const listName =
    TARGET_VARIABLE +
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const indexCode = this.valueToCode(block, 'INDEX', this.ORDER_NONE) || 1;
  const code = `${listName}[runtime.index(${indexCode}, ${listName}.length)]`;
  return [code, this.ORDER_CONDITIONAL];
};

javascriptGenerator['data_itemnumoflist'] = function (block) {
  const listName =
    TARGET_VARIABLE +
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || 0;
  return [`(${listName}.indexOf(${itemValue}) + 1)`, this.ORDER_NONE];
};

javascriptGenerator['data_lengthoflist'] = function (block) {
  const listName =
    TARGET_VARIABLE +
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  return [`${listName}.length`, this.ORDER_MEMBER];
};

javascriptGenerator['data_listcontainsitem'] = function (block) {
  const listName =
    TARGET_VARIABLE +
    this.variableDB_.getName(block.getFieldValue('LIST'), ScratchBlocks.Variables.NAME_TYPE) +
    ScratchBlocks.LIST_VARIABLE_TYPE;
  const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || 0;
  return [`${listName}.includes(${itemValue})`, this.ORDER_FUNCTION_CALL];
};
