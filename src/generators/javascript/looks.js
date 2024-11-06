import { javascriptGenerator } from './generator';

const AWAIT_ABORT = 'if (abort || !runtime.running) break;\n';

javascriptGenerator['looks_sayforsecs'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const msgCode = this.valueToCode(block, 'MESSAGE', this.ORDER_NONE) || '""';
  const secCode = this.valueToCode(block, 'SECS', this.ORDER_NONE) || 2;
  code += `await target.util.say(String(${msgCode}), runtime.number(${secCode}));\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['looks_say'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const msgCode = this.valueToCode(block, 'MESSAGE', this.ORDER_NONE) || '""';
  code += `target.util.say(String(${msgCode}));\n`;
  return code;
};

javascriptGenerator['looks_thinkforsecs'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const msgCode = this.valueToCode(block, 'MESSAGE', this.ORDER_NONE) || '""';
  const secCode = this.valueToCode(block, 'SECS', this.ORDER_NONE) || 2;
  code += `await target.util.think(String(${msgCode}), runtime.number(${secCode}));\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['looks_think'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const msgCode = this.valueToCode(block, 'MESSAGE', this.ORDER_NONE) || '""';
  code += `target.util.think(String(${msgCode}));\n`;
  return code;
};

javascriptGenerator['looks_show'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `target.util.hidden = false;\n`;
  return code;
};

javascriptGenerator['looks_hide'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `target.util.hidden = true;\n`;
  return code;
};

javascriptGenerator['looks_changesizeby'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const changeCode = this.valueToCode(block, 'CHANGE', this.ORDER_NONE) || 10;
  code += `target.util.size += runtime.number(${changeCode});\n`;
  return code;
};

javascriptGenerator['looks_setsizeto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const sizeCode = this.valueToCode(block, 'SIZE', this.ORDER_NONE) || 100;
  code += `target.util.size = ${sizeCode};\n`;
  return code;
};

javascriptGenerator['looks_size'] = function () {
  return ['target.util.size', this.ORDER_MEMBER];
};

javascriptGenerator['looks_costume'] = function (block) {
  const code = this.quote_(block.getFieldValue('COSTUME'));
  return [code, this.ORDER_ATOMIC];
};

javascriptGenerator['looks_switchcostumeto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const costumeCode = this.valueToCode(block, 'COSTUME', this.ORDER_NONE) || '""';
  code += `target.util.costume = ${costumeCode};\n`;
  return code;
};

javascriptGenerator['looks_nextcostume'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `target.util.costume++;\n`;
  return code;
};

javascriptGenerator['looks_backdrops'] = function (block) {
  const code = this.quote_(block.getFieldValue('BACKDROP'));
  return [code, this.ORDER_ATOMIC];
};

javascriptGenerator['looks_switchbackdropto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const backdropCode = this.valueToCode(block, 'BACKDROP', this.ORDER_NONE) || '""';
  code += `stage.util.backdrop = ${backdropCode};\n`;
  return code;
};

javascriptGenerator['looks_nextbackdrop'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `stage.util.backdrop++;\n`;
  return code;
};

javascriptGenerator['looks_gotofrontback'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const frontOrBackValue = this.quote_(block.getFieldValue('FRONT_BACK'));
  code += `target.util.zIndex = ${frontOrBackValue};\n`;
  return code;
};

javascriptGenerator['looks_goforwardbackwardlayers'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const forwardOrBackwardValue = block.getFieldValue('FORWARD_BACKWARD');
  const changeCode = this.valueToCode(block, 'NUM', this.ORDER_NONE);
  code += `target.util.zIndex ${forwardOrBackwardValue === 'backward' ? '-' : '+'}= runtime.number(${changeCode});\n`;
  return code;
};

javascriptGenerator['looks_backdropnumbername'] = function (block) {
  const numberOrNameValue = block.getFieldValue('NUMBER_NAME');
  const code = numberOrNameValue === 'name' ? 'stage.util.backdropName' : 'stage.util.backdrop';
  return [code, this.ORDER_MEMBER];
};

javascriptGenerator['looks_costumenumbername'] = function (block) {
  const numberOrNameValue = block.getFieldValue('NUMBER_NAME');
  const code = numberOrNameValue === 'name' ? 'target.util.costumeName' : 'target.util.costume';
  return [code, this.ORDER_MEMBER];
};

javascriptGenerator['looks_switchbackdroptoandwait'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const backdropCode = this.valueToCode(block, 'BACKDROP', this.ORDER_NONE) || '""';
  code += `stage.util.backdrop = ${backdropCode};\nawait runtime.fire('backdropswitchesto:' + ${backdropCode});\n${AWAIT_ABORT}`;
  return code;
};
