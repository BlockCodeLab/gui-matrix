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

      const varTarget = variables[i].isLocal ? 'target' : 'stage';
      let varName = this.getVariableName(variables[i].getId());
      let varValue = '0';
      if (variables[i].type === ScratchBlocks.LIST_VARIABLE_TYPE) {
        varName = `${varName}_ls`;
        varValue = '[]';
      }
      defvars.push(`targetUtils.defVariable(${varTarget}, '${varName}', ${varValue})`);
    }

    // Add developer variables (not created or named by the user).
    var devVarList = ScratchBlocks.Variables.allDeveloperVariables(workspace);
    for (var i = 0; i < devVarList.length; i++) {
      let varName = this.getVariableName(variables[i].getId(), ScratchBlocks.Names.DEVELOPER_VARIABLE_TYPE);
      let varValue = '0';
      if (variables[i].type === ScratchBlocks.LIST_VARIABLE_TYPE) {
        varName = `${varName}_ls`;
        varValue = '[]';
      }
      defvars.push(`targetUtils.defVariable(stage, '${varName}', ${varValue})`);
    }

    // Declare all of the variables.
    if (defvars.length) {
      this.definitions_['variables'] = defvars.join('\n');
    }
  }

  get TARGET_HAT_CALLBACK() {
    const code = this.HAT_CALLBACK;
    return code.replace('(done) => {\n', '(target, done) => {\n');
  }

  // 循环机制
  loopToCode(block, name) {
    let code = super.loopToCode(block, name);
    // 如果目标不存在，退出
    code += `${this.INDENT}if (!target.parent) return;\n`;
    return code;
  }
}

// 设备
export class ArcadePythonGenerator extends MicroPythonGenerator {
  onVariableDefinitions(workspace) {
    const defvars = [];
    // Add user variables.
    const variables = workspace.getAllVariables();
    for (let i = 0; i < variables.length; i++) {
      if (variables[i].type === ScratchBlocks.BROADCAST_MESSAGE_VARIABLE_TYPE) {
        continue;
      }

      const varTarget = variables[i].isLocal ? 'target.data' : 'stage.data';
      let varName = this.getVariableName(variables[i].getId());
      let varValue = '0';
      if (variables[i].type === ScratchBlocks.LIST_VARIABLE_TYPE) {
        varName = `${varName}_ls`;
        varValue = '[]';
      }
      defvars.push(`${varTarget}['${varName}'] = ${varValue}`);
    }

    // Add developer variables (not created or named by the user).
    const devVarList = ScratchBlocks.Variables.allDeveloperVariables(workspace);
    for (let i = 0; i < devVarList.length; i++) {
      let varName = this.getVariableName(devVarList[i], ScratchBlocks.Names.DEVELOPER_VARIABLE_TYPE);
      let varValue = '0';
      if (variables[i].type === ScratchBlocks.LIST_VARIABLE_TYPE) {
        varName = `${varName}_ls`;
        varValue = '[]';
      }
      defvars.push(`stage.data['${varName}'] = ${varValue}`);
    }

    // Declare all of the variables.
    if (defvars.length) {
      this.definitions_['variables'] = defvars.join('\n');
    }
  }

  // 将事件积木转为代码
  eventToCode(name, flash, ...args) {
    const eventName = this.getProcedureName(name);
    let code = '';
    code += `async def ${eventName}(${args.join(',')}):\n`;
    code += `${this.INDENT}func_id = f"{__name__}.${eventName}"\n`; // 用于停止其他脚本时过滤需要停止的脚本
    code += `${this.INDENT}flash_mode = ${flash}\n`;
    code += `${this.INDENT}force_wait = time.ticks_ms()\n`;
    code += `${this.INDENT}render_mode = False\n`;
    code += this.PASS;
    return code;
  }

  // 将循环积木转为代码
  loopToCode(block, name) {
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
    code += this.statementToCode(block, name) || `${this.INDENT}await runtime.next_tick()\n`;
    // 防止死循环
    code += `${this.INDENT}loop_times = time.ticks_diff(time.ticks_ms(), force_wait)\n`;
    code += `${this.INDENT}if (not render_mode and not flash_mode) or loop_times > 300:\n`;
    code += `${this.INDENT}${this.INDENT}await runtime.next_tick()\n`;
    code += `${this.INDENT}${this.INDENT}force_wait = time.ticks_ms()\n`;
    return code;
  }
}
