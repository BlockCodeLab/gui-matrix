import { ScratchBlocks, EmulatorGenerator } from '@blockcode/blocks';

// 模拟器
export class MatrixEmulatorGenerator extends EmulatorGenerator {
  onVariableDefinitions(workspace) {
    const defvars = [];
    const variables = workspace.getAllVariables();
    for (let i = 0; i < variables.length; i++) {
      const variable = variables[i];
      if (variable.type === ScratchBlocks.BROADCAST_MESSAGE_VARIABLE_TYPE) {
        continue;
      }

      // 全部和局部变量
      const varTarget = variable.isLocal ? 'target' : 'stage';
      const varName = this.quote_(variable.getId());
      let varValue = '0';
      if (variable.type === ScratchBlocks.LIST_VARIABLE_TYPE) {
        varValue = '[]';
      } else if (variable.type === ScratchBlocks.DICTIONARY_VARIABLE_TYPE) {
        varValue = '{}';
      }
      defvars.push(`targetUtils.defVariable(${varTarget}, ${varName}, ${varValue});`);
    }

    if (defvars.length) {
      this.definitions_['variables'] = defvars.join('\n');
    }
  }

  addEventTrap(branchCode) {
    let code = '';
    code += '  userscript.stage = stage;\n';
    code += '  userscript.target = target;\n';
    code += branchCode;
    return super.addEventTrap(code);
  }

  addLoopTrap(branchCode, id) {
    let code = '';
    // 如果目标不存在（克隆体删除，不在舞台），退出
    code += `  if (!target.parent) return;\n`;
    code += super.addLoopTrap(branchCode, id);
    return code;
  }
}
