import { ScratchBlocks, MPYGenerator } from '@blockcode/blocks';

export class ArcadepyGenerator extends MPYGenerator {
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
}
