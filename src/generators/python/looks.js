import { pythonGenerator } from './generator';

pythonGenerator['looks_sayforsecs'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }

  const msgCode = pythonGenerator.valueToCode(block, 'MESSAGE', pythonGenerator.ORDER_NONE) || '""';
  const secCode = pythonGenerator.valueToCode(block, 'SECS', pythonGenerator.ORDER_NONE) || 2;
  code += `await target.say_wait(str(${msgCode}), num(${secCode}))\n`;
  return code;
};

pythonGenerator['looks_say'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }

  const msgCode = pythonGenerator.valueToCode(block, 'MESSAGE', pythonGenerator.ORDER_NONE) || '""';
  code += `target.say(str(${msgCode}))\n`;
  return code;
};

pythonGenerator['looks_thinkforsecs'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }

  const msgCode = pythonGenerator.valueToCode(block, 'MESSAGE', pythonGenerator.ORDER_NONE) || '""';
  const secCode = pythonGenerator.valueToCode(block, 'SECS', pythonGenerator.ORDER_NONE) || 2;
  code += `await target.think_wait(str(${msgCode}), num(${secCode}))\n`;
  return code;
};

pythonGenerator['looks_think'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }

  const msgCode = pythonGenerator.valueToCode(block, 'MESSAGE', pythonGenerator.ORDER_NONE) || '""';
  code += `target.think(str(${msgCode}))\n`;
  return code;
};

pythonGenerator['looks_show'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  code += `target.hidden = False\n`;
  return code;
};

pythonGenerator['looks_hide'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  code += `target.hidden = True\n`;
  return code;
};

pythonGenerator['looks_changesizeby'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const changeCode = pythonGenerator.valueToCode(block, 'CHANGE', pythonGenerator.ORDER_NONE) || 10;
  code += `target.size += num(${changeCode})\n`;
  return code;
};

pythonGenerator['looks_setsizeto'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const sizeCode = pythonGenerator.valueToCode(block, 'SIZE', pythonGenerator.ORDER_NONE) || 100;
  code += `target.size = num(${sizeCode})\n`;
  return code;
};

pythonGenerator['looks_size'] = () => {
  return ['target.size', pythonGenerator.ORDER_MEMBER];
};

pythonGenerator['looks_costume'] = (block) => {
  const code = pythonGenerator.quote_(block.getFieldValue('COSTUME'));
  return [code, pythonGenerator.ORDER_ATOMIC];
};

pythonGenerator['looks_switchcostumeto'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const costumeCode = pythonGenerator.valueToCode(block, 'COSTUME', pythonGenerator.ORDER_NONE) || '""';
  code += `target.frame_name = ${costumeCode}\n`;
  return code;
};

pythonGenerator['looks_nextcostume'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  code += `target.frame_number += 1\n`;
  return code;
};

pythonGenerator['looks_backdrops'] = (block) => {
  const code = pythonGenerator.quote_(block.getFieldValue('BACKDROP'));
  return [code, pythonGenerator.ORDER_ATOMIC];
};

pythonGenerator['looks_switchbackdropto'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const backdropCode = pythonGenerator.valueToCode(block, 'BACKDROP', pythonGenerator.ORDER_NONE) || '""';
  code += `stage.frame_name = ${backdropCode}\n`;
  code += `runtime.backdropswitchesto(${backdropCode})\n`;
  return code;
};

pythonGenerator['looks_nextbackdrop'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  code += `stage.frame_number += 1\n`;
  return code;
};

pythonGenerator['looks_gotofrontback'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const frontOrBackValue = block.getFieldValue('FRONT_BACK');
  code += `target.go_${frontOrBackValue}()\n`;
  return code;
};

pythonGenerator['looks_goforwardbackwardlayers'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const forwardOrBackwardValue = block.getFieldValue('FORWARD_BACKWARD');
  const changeCode = pythonGenerator.valueToCode(block, 'NUM', pythonGenerator.ORDER_NONE);
  code += `target.z_index ${forwardOrBackwardValue === 'backward' ? '-' : '+'}= num(${changeCode})\n`;
  return code;
};

pythonGenerator['looks_backdropnumbername'] = (block) => {
  const numberOrNameValue = block.getFieldValue('NUMBER_NAME');
  const code = numberOrNameValue === 'name' ? 'stage.frame_name' : 'stage.frame_number';
  return [code, pythonGenerator.ORDER_MEMBER];
};

pythonGenerator['looks_costumenumbername'] = (block) => {
  const numberOrNameValue = block.getFieldValue('NUMBER_NAME');
  const code = numberOrNameValue === 'name' ? 'target.frame_name' : 'target.frame_number';
  return [code, pythonGenerator.ORDER_MEMBER];
};

pythonGenerator['looks_switchbackdroptoandwait'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const backdropCode = pythonGenerator.valueToCode(block, 'BACKDROP', pythonGenerator.ORDER_NONE) || '""';
  code += `stage.frame_name = ${backdropCode}\n`;
  code += `await runtime.backdropswitchesto(${backdropCode}, waiting=True)\n`;
  return code;
};
