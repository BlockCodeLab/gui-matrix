export default () => ({
  id: 'data',
  skipXML: true,
  blocks: [
    // 变量
    {
      id: 'variable',
      emu(block) {
        const varId = this.quote_(block.getFieldValue('VARIABLE'));
        const code = `targetUtils.getVariable(userscript, ${varId})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'setvariableto',
      emu(block) {
        const varId = this.quote_(block.getFieldValue('VARIABLE'));
        const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || '""';
        const code = `targetUtils.setVariable(userscript, ${varId}, ${valueCode});\n`;
        return code;
      },
    },
    {
      id: 'changevariableby',
      emu(block) {
        const varId = this.quote_(block.getFieldValue('VARIABLE'));
        const valueCode = this.valueToCode(block, 'VALUE', this.ORDER_NONE) || '0';
        const code = `targetUtils.incVariable(userscript, ${varId}, ${valueCode});\n`;
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
        const listId = this.quote_(block.getFieldValue('LIST'));
        const code = `targetUtils.getVariable(userscript, ${listId})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'addtolist',
      emu(block) {
        const listId = this.quote_(block.getFieldValue('LIST'));
        const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
        const code = `targetUtils.pushValueToList(userscript, ${listId}, ${itemValue});\n`;
        return code;
      },
    },
    {
      id: 'deleteoflist',
      emu(block) {
        const listId = this.quote_(block.getFieldValue('LIST'));
        const indexCode = this.getAdjusted(block, 'INDEX');
        const code = `targetUtils.delValueFromList(userscript, ${listId}, ${indexCode});\n`;
        return code;
      },
    },
    {
      id: 'deletealloflist',
      emu(block) {
        const listId = this.quote_(block.getFieldValue('LIST'));
        const code = `targetUtils.delAllFromList(userscript, ${listId});\n`;
        return code;
      },
    },
    {
      id: 'insertatlist',
      emu(block) {
        const listId = this.quote_(block.getFieldValue('LIST'));
        const indexCode = this.getAdjusted(block, 'INDEX');
        const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
        const code = `targetUtils.insertValueToList(userscript, ${listId}, ${indexCode}, ${itemValue});\n`;
        return code;
      },
    },
    {
      id: 'replaceitemoflist',
      emu(block) {
        const listId = this.quote_(block.getFieldValue('LIST'));
        const indexCode = this.getAdjusted(block, 'INDEX');
        const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || '""';
        const code = `targetUtils.setValueToList(userscript, ${listId}, ${indexCode}, ${itemValue});\n`;
        return code;
      },
    },
    {
      id: 'itemoflist',
      emu(block) {
        const listId = this.quote_(block.getFieldValue('LIST'));
        const indexCode = this.getAdjusted(block, 'INDEX');
        const code = `targetUtils.getValueFromList(userscript, ${listId}, ${indexCode})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'itemnumoflist',
      emu(block) {
        const listId = this.quote_(block.getFieldValue('LIST'));
        const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || 0;
        const code = `targetUtils.findValueFromList(userscript, ${listId}, ${itemValue})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'lengthoflist',
      emu(block) {
        const listId = this.quote_(block.getFieldValue('LIST'));
        const code = `targetUtils.getLengthOfList(userscript, ${listId})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
    {
      id: 'listcontainsitem',
      emu(block) {
        const listId = this.quote_(block.getFieldValue('LIST'));
        const itemValue = this.valueToCode(block, 'ITEM', this.ORDER_NONE) || 0;
        const code = `!!targetUtils.findValueFromList(userscript, ${listId}, ${itemValue})`;
        return [code, this.ORDER_FUNCTION_CALL];
      },
    },
  ],
});
