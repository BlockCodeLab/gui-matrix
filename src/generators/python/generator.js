import { ScratchBlocks } from '@blockcode/blocks-editor';
import { PythonGenerator } from '@blockcode/workspace-blocks/app';

class ArcadePythonGenerator extends PythonGenerator {
  init(workspace) {
    super.init(workspace);

    const defvars = [];
    // Add user variables.
    const variables = workspace.getAllVariables();
    for (let i = 0; i < variables.length; i++) {
      if (variables[i].type === ScratchBlocks.BROADCAST_MESSAGE_VARIABLE_TYPE) {
        continue;
      }

      const varTarget = variables[i].isLocal ? 'target.data' : 'stage.data';
      let varName = this.variableDB_.getName(variables[i].getId(), ScratchBlocks.Variables.NAME_TYPE);
      let varValue = '0';
      if (variables[i].type === ScratchBlocks.LIST_VARIABLE_TYPE) {
        varName = `${varName}_${ScratchBlocks.LIST_VARIABLE_TYPE}`;
        varValue = '[]';
      }
      defvars.push(`${varTarget}['${varName}'] = ${varValue}`);
    }

    // Add developer variables (not created or named by the user).
    const devVarList = ScratchBlocks.Variables.allDeveloperVariables(workspace);
    for (let i = 0; i < devVarList.length; i++) {
      let varName = this.variableDB_.getName(devVarList[i], ScratchBlocks.Names.DEVELOPER_VARIABLE_TYPE);
      let varValue = '0';
      if (variables[i].type === ScratchBlocks.LIST_VARIABLE_TYPE) {
        varName = `${varName}_${ScratchBlocks.LIST_VARIABLE_TYPE}`;
        varValue = '[]';
      }
      defvars.push(`stage.data['${varName}'] = ${varValue}`);
    }

    // Add prepose definitions
    if (this.addPreposeDefinitions) {
      this.addPreposeDefinitions(defvars);
    }

    // Declare all of the variables.
    if (defvars.length) {
      this.definitions_['variables'] = defvars.join('\n');
    }
  }
}

export const pythonGenerator = new ArcadePythonGenerator();
