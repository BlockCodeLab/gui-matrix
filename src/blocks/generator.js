import { ScratchBlocks, EmulatorGenerator, MicroPythonGenerator } from '@blockcode/blocks';

// 模拟器
export class ArcadeEmulatorGenerator extends EmulatorGenerator {
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

// 设备
export class ArcadePythonGenerator extends MicroPythonGenerator {
  INFINITE_LOOP_TRAP = 'await runtime.next_tick()\n';

  onVariableDefinitions(workspace) {
    const defvars = [];
    // Add user variables.
    const variables = workspace.getAllVariables();
    for (let i = 0; i < variables.length; i++) {
      if (variables[i].type === ScratchBlocks.BROADCAST_MESSAGE_VARIABLE_TYPE) {
        continue;
      }

      // 全部和局部变量
      const varTarget = variables[i].isLocal ? 'target.data' : 'stage.data';
      let varName = this.getVariableName(variables[i].getId());
      let varValue = '0';
      if (variables[i].type === ScratchBlocks.LIST_VARIABLE_TYPE) {
        varName = `${varName}_ls`;
        varValue = '[]';
      } else if (variables[i].type === ScratchBlocks.DICTIONARY_VARIABLE_TYPE) {
        varName = `${varName}_dt`;
        varValue = '{}';
      }
      defvars.push(`${varTarget}['${varName}'] = ${varValue}`);
    }

    // Declare all of the variables.
    if (defvars.length) {
      this.definitions_['variables'] = defvars.join('\n');
    }
  }

  addEventTrap(branchCode, id) {
    const funcName = this.getFunctionName(id);
    let code = '';
    code += `async def ${funcName}():\n`;
    code += `${this.INDENT}func_id = f"{__name__}.${funcName}"\n`; // 用于停止其他脚本时过滤需要停止的脚本
    code += `${this.INDENT}flash_mode = runtime.flash_mode\n`;
    code += `${this.INDENT}force_wait = time.ticks_ms()\n`;
    code += `${this.INDENT}render_mode = False\n`;
    code += branchCode;
    return code;
  }

  addLoopTrap(branchCode, id) {
    let code = '';
    // 如果目标（克隆体）不在舞台，退出
    code += `${this.INDENT}if not target.stage:\n`;
    code += `${this.INDENT}${this.INDENT}return\n`;
    // 等待帧渲染
    code += `${this.INDENT}if render_mode and not flash_mode:\n`;
    code += `${this.INDENT}${this.INDENT}await runtime.next_frame()\n`;
    code += `${this.INDENT}${this.INDENT}force_wait = time.ticks_ms()\n`;
    code += `${this.INDENT}${this.INDENT}render_mode = False\n`;
    // 循环代码
    code += super.addLoopTrap(branchCode, id);
    // 防止死循环
    code += `${this.INDENT}loop_times = time.ticks_diff(time.ticks_ms(), force_wait)\n`;
    code += `${this.INDENT}if (not render_mode and not flash_mode) or loop_times > 300:\n`;
    code += `${this.INDENT}${this.INDENT}await runtime.next_tick()\n`;
    code += `${this.INDENT}${this.INDENT}force_wait = time.ticks_ms()\n`;
    return code;
  }
}
