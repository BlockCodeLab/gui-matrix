import { javascriptGenerator } from './generator';

const AWAIT_ABORT = 'if (abort || !runtime.running) break;\n';

javascriptGenerator['looks_sayforsecs'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  const msgCode = javascriptGenerator.valueToCode(block, 'MESSAGE', javascriptGenerator.ORDER_NONE) || '""';
  const secCode = javascriptGenerator.valueToCode(block, 'SECS', javascriptGenerator.ORDER_NONE) || 2;
  code += `await target.util.say(String(${msgCode}), runtime.number(${secCode}));\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['looks_say'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  const msgCode = javascriptGenerator.valueToCode(block, 'MESSAGE', javascriptGenerator.ORDER_NONE) || '""';
  code += `target.util.say(String(${msgCode}));\n`;
  return code;
};

javascriptGenerator['looks_thinkforsecs'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  const msgCode = javascriptGenerator.valueToCode(block, 'MESSAGE', javascriptGenerator.ORDER_NONE) || '""';
  const secCode = javascriptGenerator.valueToCode(block, 'SECS', javascriptGenerator.ORDER_NONE) || 2;
  code += `await target.util.think(String(${msgCode}), runtime.number(${secCode}));\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['looks_think'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  const msgCode = javascriptGenerator.valueToCode(block, 'MESSAGE', javascriptGenerator.ORDER_NONE) || '""';
  code += `target.util.think(String(${msgCode}));\n`;
  return code;
};

javascriptGenerator['looks_show'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  code += `target.util.hidden = false;\n`;
  return code;
};

javascriptGenerator['looks_hide'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  code += `target.util.hidden = true;\n`;
  return code;
};

javascriptGenerator['looks_changesizeby'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const changeCode = javascriptGenerator.valueToCode(block, 'CHANGE', javascriptGenerator.ORDER_NONE) || 10;
  code += `target.util.size += runtime.number(${changeCode});\n`;
  return code;
};

javascriptGenerator['looks_setsizeto'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const sizeCode = javascriptGenerator.valueToCode(block, 'SIZE', javascriptGenerator.ORDER_NONE) || 100;
  code += `target.util.size = ${sizeCode};\n`;
  return code;
};

javascriptGenerator['looks_size'] = () => {
  return ['target.util.size', javascriptGenerator.ORDER_MEMBER];
};

javascriptGenerator['looks_costume'] = (block) => {
  const code = javascriptGenerator.quote_(block.getFieldValue('COSTUME'));
  return [code, javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['looks_switchcostumeto'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const costumeCode = javascriptGenerator.valueToCode(block, 'COSTUME', javascriptGenerator.ORDER_NONE) || '""';
  code += `target.util.costume = ${costumeCode};\n`;
  return code;
};

javascriptGenerator['looks_nextcostume'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  code += `target.util.costume++;\n`;
  return code;
};

javascriptGenerator['looks_backdrops'] = (block) => {
  const code = javascriptGenerator.quote_(block.getFieldValue('BACKDROP'));
  return [code, javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['looks_switchbackdropto'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const backdropCode = javascriptGenerator.valueToCode(block, 'BACKDROP', javascriptGenerator.ORDER_NONE) || '""';
  code += `stage.util.backdrop = ${backdropCode};\n`;
  return code;
};

javascriptGenerator['looks_nextbackdrop'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  code += `stage.util.backdrop++;\n`;
  return code;
};

javascriptGenerator['looks_gotofrontback'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const frontOrBackValue = javascriptGenerator.quote_(block.getFieldValue('FRONT_BACK'));
  code += `target.util.zIndex = ${frontOrBackValue};\n`;
  return code;
};

javascriptGenerator['looks_goforwardbackwardlayers'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const forwardOrBackwardValue = block.getFieldValue('FORWARD_BACKWARD');
  const changeCode = javascriptGenerator.valueToCode(block, 'NUM', javascriptGenerator.ORDER_NONE);
  code += `target.util.zIndex ${forwardOrBackwardValue === 'backward' ? '-' : '+'}= runtime.number(${changeCode});\n`;
  return code;
};

javascriptGenerator['looks_backdropnumbername'] = (block) => {
  const numberOrNameValue = block.getFieldValue('NUMBER_NAME');
  const code = numberOrNameValue === 'name' ? 'stage.util.backdropName' : 'stage.util.backdrop';
  return [code, javascriptGenerator.ORDER_MEMBER];
};

javascriptGenerator['looks_costumenumbername'] = (block) => {
  const numberOrNameValue = block.getFieldValue('NUMBER_NAME');
  const code = numberOrNameValue === 'name' ? 'target.util.costumeName' : 'target.util.costume';
  return [code, javascriptGenerator.ORDER_MEMBER];
};

javascriptGenerator['looks_switchbackdroptoandwait'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  const backdropCode = javascriptGenerator.valueToCode(block, 'BACKDROP', javascriptGenerator.ORDER_NONE) || '""';
  code += `stage.util.backdrop = ${backdropCode};\nawait runtime.fire('backdropswitchesto:' + ${backdropCode});\n${AWAIT_ABORT}`;
  return code;
};
