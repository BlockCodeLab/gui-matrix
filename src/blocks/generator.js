import { ScratchBlocks, EmulatorGenerator, MicroPythonGenerator } from '@blockcode/blocks';

// 模拟器
export class ArcadeEmulatorGenerator extends EmulatorGenerator {
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

  addLoopTrap(branchCode, id) {
    let code = super.addLoopTrap(branchCode, id);
    // 如果目标不存在（克隆体删除，不在舞台），退出
    code += `${this.INDENT}if (!target.parent) break;\n`;
    return code;
  }
}

// 设备
export class ArcadePythonGenerator extends MicroPythonGenerator {
  INFINITE_LOOP_TRAP = 'await runtime.next_tick()\n';

  finish(code) {
    // Convert the definitions dictionary into a list.
    const imports = [];
    const definitions = [];
    for (let name in this.definitions_) {
      if (name === 'variables') continue;
      const def = this.definitions_[name];
      if (def.match(/^(from\s+\S+\s+)?import\s+\S+/)) {
        imports.push(def);
      } else {
        definitions.push(def);
      }
    }
    definitions.push(this.definitions_['variables']);
    // Clean up temporary data.
    delete this.definitions_;
    delete this.functionNames_;
    this.variableDB_.reset();
    const allDefs = imports.join('\n') + '\n\n' + definitions.join('\n\n');
    return allDefs.replace(/\n\n+/g, '\n\n').replace(/\n*$/, '\n\n\n') + code;
  }

  onVariableDefinitions(workspace) {
    const defvars = [];
    // Add user variables.
    const variables = workspace.getAllVariables();
    for (let i = 0; i < variables.length; i++) {
      if (variables[i].type === ScratchBlocks.BROADCAST_MESSAGE_VARIABLE_TYPE) {
        continue;
      }

      // 全部和局部变量
      const varTarget = variables[i].isLocal ? 'target' : 'stage';
      let varName = this.quote_(variables[i].getId());
      let varValue = '0';
      if (variables[i].type === ScratchBlocks.LIST_VARIABLE_TYPE) {
        varValue = '[]';
      } else if (variables[i].type === ScratchBlocks.DICTIONARY_VARIABLE_TYPE) {
        varValue = '{}';
      }
      defvars.push(`runtime.def_variable(${varTarget}, ${varName}, ${varValue})`);
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
    // 如果目标不是舞台或（克隆体）不在舞台，退出
    code += `${this.INDENT}if not (isinstance(target, Stage) or target.stage):\n`;
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
