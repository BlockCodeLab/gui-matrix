import { ScratchBlocks } from '@blockcode/blocks';
import { ArcademuGenerator } from './generator';

const proto = ArcademuGenerator.prototype;

proto['data_variable'] = function (block) {
  const varName = this.quote_(this.getVariableName(block.getFieldValue('VARIABLE')));
  return [`targetUtils.getVariable(target, stage, ${varName})`, this.ORDER_FUNCTION_CALL];
};

proto['data_setvariableto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const varName = this.quote_(this.getVariableName(block.getFieldValue('VARIABLE')));
  const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || '""';
  code += `targetUtils.setVariable(target, stage, ${varName}, ${valueCode});\n`;
  return code;
};

proto['data_changevariableby'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const varName = this.quote_(this.getVariableName(block.getFieldValue('VARIABLE')));
  const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || '0';
  code += `targetUtils.incVariable(target, stage, ${varName}, ${valueCode});\n`;
  return code;
};

proto['data_listcontents'] = function (block) {
  const listName = this.quote_(`${this.getVariableName(block.getFieldValue('LIST'))}_ls`);
  return [`targetUtils.getVariable(target, stage, ${listName})`, this.ORDER_FUNCTION_CALL];
};

proto['data_addtolist'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const listName = this.quote_(`${this.getVariableName(block.getFieldValue('LIST'))}_ls`);
  const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
  code += `targetUtils.pushValueToList(target, stage, ${listName}, ${itemValue});\n`;
  return code;
};

proto['data_deleteoflist'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const listName = this.quote_(`${this.getVariableName(block.getFieldValue('LIST'))}_ls`);
  const indexCode = this.getAdjusted(block, 'INDEX');
  code += `targetUtils.delValueFromList(target, stage, ${listName}, ${indexCode});\n`;
  return code;
};

proto['data_deletealloflist'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const listName = this.quote_(`${this.getVariableName(block.getFieldValue('LIST'))}_ls`);
  code += `targetUtils.delAllFromList(target, stage, ${listName});\n`;
  return code;
};

proto['data_insertatlist'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const listName = this.quote_(`${this.getVariableName(block.getFieldValue('LIST'))}_ls`);
  const indexCode = this.getAdjusted(block, 'INDEX');
  const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
  code += `targetUtils.insertValueToList(target, stage, ${listName}, ${indexCode}, ${itemValue});\n`;
  return code;
};

proto['data_replaceitemoflist'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const listName = this.quote_(`${this.getVariableName(block.getFieldValue('LIST'))}_ls`);
  const indexCode = this.getAdjusted(block, 'INDEX');
  const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
  code += `targetUtils.setValueToList(target, stage, ${listName}, ${indexCode}, ${itemValue});\n`;
  return code;
};

proto['data_itemoflist'] = function (block) {
  const listName = this.quote_(`${this.getVariableName(block.getFieldValue('LIST'))}_ls`);
  const indexCode = this.getAdjusted(block, 'INDEX');
  const code = `targetUtils.getValueFromList(target, stage, ${listName}, ${indexCode})`;
  return [code, this.ORDER_FUNCTION_CALL];
};

proto['data_itemnumoflist'] = function (block) {
  const listName = this.quote_(`${this.getVariableName(block.getFieldValue('LIST'))}_ls`);
  const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || 0;
  const code = `targetUtils.findValueFromList(target, stage, ${listName}, ${itemValue})`;
  return [code, this.ORDER_FUNCTION_CALL];
};

proto['data_lengthoflist'] = function (block) {
  const listName = this.quote_(`${this.getVariableName(block.getFieldValue('LIST'))}_ls`);
  const code = `targetUtils.getLengthOfList(target, stage, ${listName})`;
  return [code, this.ORDER_FUNCTION_CALL];
};

proto['data_listcontainsitem'] = function (block) {
  const listName = this.quote_(`${this.getVariableName(block.getFieldValue('LIST'))}_ls`);
  const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || 0;
  const code = `!!targetUtils.findValueFromList(target, stage, ${listName}, ${itemValue})`;
  return [code, this.ORDER_FUNCTION_CALL];
};
