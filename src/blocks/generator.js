import { ScratchBlocks, EmulatorGenerator } from '@blockcode/blocks';

// 模拟器
export class MatrixEmulatorGenerator extends EmulatorGenerator {
  onVariableDefinitions(workspace) {
    var defvars = [];
    // Add user variables.
    var variables = workspace.getAllVariables();
    for (var i = 0; i < variables.length; i++) {
      if (variables[i].type === ScratchBlocks.BROADCAST_MESSAGE_VARIABLE_TYPE) {
        continue;
      }

      // 全部和局部变量
      const varTarget = variables[i].isLocal ? 'target' : 'stage';
      let varName = this.getVariableName(variables[i].getId());
      let varValue = '0';
      if (variables[i].type === ScratchBlocks.LIST_VARIABLE_TYPE) {
        varName = `${varName}_ls`;
        varValue = '[]';
      } else if (variables[i].type === ScratchBlocks.DICTIONARY_VARIABLE_TYPE) {
        varName = `${varName}_dt`;
        varValue = '{}';
      }
      defvars.push(`targetUtils.defVariable(${varTarget}, '${varName}', ${varValue})`);
    }

    // Declare all of the variables.
    if (defvars.length) {
      this.definitions_['variables'] = defvars.join('\n');
    }
  }

  addLoopTrap(branchCode, id) {
    let code = super.addLoopTrap(branchCode, id);
    // 如果目标不存在（克隆体删除，不在舞台），退出
    code += `${this.INDENT}if (!target.parent) return;\n`;
    return code;
  }
}
