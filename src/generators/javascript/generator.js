import { ScratchBlocks } from '@blockcode/blocks-editor';
import { JavascriptGenerator } from '@blockcode/blocks-player';

export class ArcadeJavascriptGenerator extends JavascriptGenerator {
  TARGET_EVENT_CALLBACK = `async (target, done) => {\nruntime.abort = false;\nconst flash = runtime.flash;\ndo {\n/* code */} while (false);\ndone();\n}`;

  init(workspace) {
    super.init(workspace);

    var defvars = [];
    // Add user variables.
    var variables = workspace.getAllVariables();
    for (var i = 0; i < variables.length; i++) {
      if (variables[i].type === ScratchBlocks.BROADCAST_MESSAGE_VARIABLE_TYPE) {
        continue;
      }

      const varTarget = variables[i].isLocal ? 'target.data' : 'stage.data';
      let varName = this.variableDB_.getName(variables[i].getId(), ScratchBlocks.Variables.NAME_TYPE);
      let varValue = '0';
      if (variables[i].type === ScratchBlocks.LIST_VARIABLE_TYPE) {
        varName = `${varName}${ScratchBlocks.LIST_VARIABLE_TYPE}`;
        varValue = '[]';
      }
      defvars.push(`${varTarget}['$${varName}'] = ${varValue}`);
    }

    // Add developer variables (not created or named by the user).
    var devVarList = ScratchBlocks.Variables.allDeveloperVariables(workspace);
    for (var i = 0; i < devVarList.length; i++) {
      let varName = this.variableDB_.getName(variables[i].getId(), ScratchBlocks.Variables.NAME_TYPE);
      let varValue = '0';
      if (variables[i].type === ScratchBlocks.LIST_VARIABLE_TYPE) {
        varName = `${varName}${ScratchBlocks.LIST_VARIABLE_TYPE}`;
        varValue = '[]';
      }
      defvars.push(`stage.data['$${varName}'] = ${varValue}`);
    }

    // Declare all of the variables.
    if (defvars.length) {
      this.definitions_['variables'] = defvars.join('\n');
    }
  }
}

export const javascriptGenerator = ArcadeJavascriptGenerator.prototype;
