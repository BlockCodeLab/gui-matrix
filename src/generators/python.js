import { ScratchBlocks } from '@blockcode/blocks-editor';
import { pythonGenerator } from '@blockcode/workspace-blocks/app';

import './python/control';
import './python/data';
import './python/events';
import './python/looks';
import './python/motion';
import './python/sensing';
import './python/sound';
import './python/wifi';

pythonGenerator.init = (workspace) => {
  pythonGenerator.PASS = pythonGenerator.INDENT + 'pass\n';
  // Create a dictionary of definitions to be printed before the code.
  pythonGenerator.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  pythonGenerator.functionNames_ = Object.create(null);

  if (!pythonGenerator.variableDB_) {
    pythonGenerator.variableDB_ = new ScratchBlocks.Names(pythonGenerator.RESERVED_WORDS_);
  } else {
    pythonGenerator.variableDB_.reset();
  }

  pythonGenerator.variableDB_.setVariableMap(workspace.getVariableMap());

  const defvars = [];
  const variables = workspace.getAllVariables();
  for (let i = 0; i < variables.length; i++) {
    if (variables[i].type === ScratchBlocks.BROADCAST_MESSAGE_VARIABLE_TYPE) {
      continue;
    }

    const varTarget = variables[i].isLocal ? 'target.data' : 'stage.data';
    let varName = pythonGenerator.variableDB_.getName(variables[i].getId(), ScratchBlocks.Variables.NAME_TYPE);
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
    let varName = pythonGenerator.variableDB_.getName(devVarList[i], ScratchBlocks.Names.DEVELOPER_VARIABLE_TYPE);
    let varValue = '0';
    if (variables[i].type === ScratchBlocks.LIST_VARIABLE_TYPE) {
      varName = `${varName}_${ScratchBlocks.LIST_VARIABLE_TYPE}`;
      varValue = '[]';
    }
    defvars.push(`stage.data['${varName}'] = ${varValue}`);
  }

  // import scratch for micropython library
  pythonGenerator.definitions_['import_scratch'] = 'from scratch import *';

  if (pythonGenerator.additionalDefinitions_) {
    pythonGenerator.additionalDefinitions_.forEach(([key, value]) => {
      if (key.startsWith('create_')) {
        defvars.unshift(value);
      } else {
        pythonGenerator.definitions_[key] = value;
      }
    });
  }

  if (defvars.length) {
    pythonGenerator.definitions_['variables'] = defvars.join('\n');
  }
};
