import { ScratchBlocks, EMUGenerator } from '@blockcode/blocks';

export class ArcademuGenerator extends EMUGenerator {
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
}
