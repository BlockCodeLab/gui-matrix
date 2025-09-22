const TARGET_VARIABLE = (name) => `target.variable[${name}]`;

export default () => ({
  id: 'data',
  skipXML: true,
  blocks: [
    // 变量
    {
      id: 'variable',
      emu(block) {
        const varName = this.quote_(block.getFieldValue('VARIABLE'));
        return [`targetUtils.getVariable(target, stage, ${varName})`, this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        const varName = TARGET_VARIABLE(this.quote_(block.getFieldValue('VARIABLE')));
        return [varName, this.ORDER_ATOMIC];
      },
    },
    {
      id: 'setvariableto',
      emu(block) {
        const varName = this.quote_(block.getFieldValue('VARIABLE'));
        const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || '""';
        const code = `targetUtils.setVariable(target, stage, ${varName}, ${valueCode});\n`;
        return code;
      },
      mpy(block) {
        const varName = TARGET_VARIABLE(this.quote_(block.getFieldValue('VARIABLE')));
        const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || '""';
        const code = `${varName} = ${valueCode}\n`;
        return code;
      },
    },
    {
      id: 'changevariableby',
      emu(block) {
        const varName = this.quote_(block.getFieldValue('VARIABLE'));
        const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || '0';
        const code = `targetUtils.incVariable(target, stage, ${varName}, ${valueCode});\n`;
        return code;
      },
      mpy(block) {
        const varName = TARGET_VARIABLE(this.quote_(block.getFieldValue('VARIABLE')));
        const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || 0;
        const code = `${varName} = num(${varName}) + num(${valueCode})\n`;
        return code;
      },
    },
    {
      id: 'showvariable',
      emu(block) {
        const varId = this.quote_(block.getFieldValue('VARIABLE'));
        const code = `runtime.setMonitorVisibleById(${varId}, true);\n`;
        return code;
      },
    },
    {
      id: 'hidevariable',
      emu(block) {
        const varId = this.quote_(block.getFieldValue('VARIABLE'));
        const code = `runtime.setMonitorVisibleById(${varId}, false);\n`;
        return code;
      },
    },
    // 列表
    {
      id: 'listcontents',
      emu(block) {
        const listName = this.quote_(block.getFieldValue('LIST'));
        return [`targetUtils.getVariable(target, stage, ${listName})`, this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        const listName = TARGET_VARIABLE(this.quote_(block.getFieldValue('LIST')));
        return [listName, this.ORDER_ATOMIC];
      },
    },
    {
      id: 'addtolist',
      emu(block) {
        const listName = this.quote_(block.getFieldValue('LIST'));
        const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
        const code = `targetUtils.pushValueToList(target, stage, ${listName}, ${itemValue});\n`;
        return code;
      },
      mpy(block) {
        const listName = TARGET_VARIABLE(this.quote_(block.getFieldValue('LIST')));
        const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
        const code = `${listName}.append(${itemValue})\n`;
        return code;
      },
    },
    {
      id: 'deleteoflist',
      emu(block) {
        const listName = this.quote_(block.getFieldValue('LIST'));
        const indexCode = this.getAdjusted(block, 'INDEX');
        const code = `targetUtils.delValueFromList(target, stage, ${listName}, ${indexCode});\n`;
        return code;
      },
      mpy(block) {
        const listName = TARGET_VARIABLE(this.quote_(block.getFieldValue('LIST')));
        const indexCode = this.valueToCode(block, 'INDEX', this.ORDER_NONE) || 1;
        const code = `runtime.list(${listName}, 'remove', num(${indexCode}))\n`;
        return code;
      },
    },
    {
      id: 'deletealloflist',
      emu(block) {
        const listName = this.quote_(block.getFieldValue('LIST'));
        const code = `targetUtils.delAllFromList(target, stage, ${listName});\n`;
        return code;
      },
      mpy(block) {
        const listName = TARGET_VARIABLE(this.quote_(block.getFieldValue('LIST')));
        const code = `${listName} = []\n`;
        return code;
      },
    },
    {
      id: 'insertatlist',
      emu(block) {
        const listName = this.quote_(block.getFieldValue('LIST'));
        const indexCode = this.getAdjusted(block, 'INDEX');
        const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
        const code = `targetUtils.insertValueToList(target, stage, ${listName}, ${indexCode}, ${itemValue});\n`;
        return code;
      },
      mpy(block) {
        const listName = TARGET_VARIABLE(this.quote_(block.getFieldValue('LIST')));
        const indexCode = this.valueToCode(block, 'INDEX', this.ORDER_NONE) || 1;
        const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
        const code = `runtime.list(${listName}, 'insert', num(${indexCode}), ${itemValue})\n`;
        return code;
      },
    },
    {
      id: 'replaceitemoflist',
      emu(block) {
        const listName = this.quote_(block.getFieldValue('LIST'));
        const indexCode = this.getAdjusted(block, 'INDEX');
        const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
        const code = `targetUtils.setValueToList(target, stage, ${listName}, ${indexCode}, ${itemValue});\n`;
        return code;
      },
      mpy(block) {
        const listName = TARGET_VARIABLE(this.quote_(block.getFieldValue('LIST')));
        const indexCode = this.valueToCode(block, 'INDEX', this.ORDER_NONE) || 1;
        const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
        const code = `runtime.list(${listName}, 'replace', num(${indexCode}), ${itemValue})\n`;
        return code;
      },
    },
    {
      id: 'itemoflist',
      emu(block) {
        const listName = this.quote_(block.getFieldValue('LIST'));
        const indexCode = this.getAdjusted(block, 'INDEX');
        const code = `targetUtils.getValueFromList(target, stage, ${listName}, ${indexCode})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        const listName = TARGET_VARIABLE(this.quote_(block.getFieldValue('LIST')));
        const indexCode = this.valueToCode(block, 'INDEX', this.ORDER_NONE) || 1;
        const code = `runtime.list(${listName}, 'get', num(${indexCode}))`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'itemnumoflist',
      emu(block) {
        const listName = this.quote_(block.getFieldValue('LIST'));
        const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || 0;
        const code = `targetUtils.findValueFromList(target, stage, ${listName}, ${itemValue})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        const listName = TARGET_VARIABLE(this.quote_(block.getFieldValue('LIST')));
        const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || 0;
        return [`(${listName}.index(${itemValue}) + 1)`, this.ORDER_NONE];
      },
    },
    {
      id: 'lengthoflist',
      emu(block) {
        const listName = this.quote_(block.getFieldValue('LIST'));
        const code = `targetUtils.getLengthOfList(target, stage, ${listName})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        const listName = TARGET_VARIABLE(this.quote_(block.getFieldValue('LIST')));
        const code = `len(${listName})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'listcontainsitem',
      emu(block) {
        const listName = this.quote_(block.getFieldValue('LIST'));
        const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || 0;
        const code = `!!targetUtils.findValueFromList(target, stage, ${listName}, ${itemValue})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
      mpy(block) {
        const listName = TARGET_VARIABLE(this.quote_(block.getFieldValue('LIST')));
        const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || 0;
        const code = `bool(${listName}.count(${itemValue}))`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
  ],
});
