import { ArcademuGenerator } from './generator';

const proto = ArcademuGenerator.prototype;

proto['looks_sayforsecs'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const optionValue = block.getFieldValue('OPTION') || 'say';
  const msgCode = this.valueToCode(block, 'MESSAGE', this.ORDER_NONE) || '""';

  let secCode = 'false';
  if (block.getInput('SECS')) {
    secCode = this.valueToCode(block, 'SECS', this.ORDER_NONE) || '2';
  }

  code += `await targetUtils.say(target, signal, ${msgCode}, ${secCode}, ${optionValue === 'shout'});\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['looks_say'] = proto['looks_sayforsecs'];

proto['looks_thinkforsecs'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const optionValue = block.getFieldValue('OPTION') || 'think';
  const msgCode = this.valueToCode(block, 'MESSAGE', this.ORDER_NONE) || '""';

  let secCode = 'false';
  if (block.getInput('SECS')) {
    secCode = this.valueToCode(block, 'SECS', this.ORDER_NONE) || '2';
  }

  code += `await targetUtils.think(target, signal, ${msgCode}, ${secCode}, ${optionValue === 'spark'});\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['looks_think'] = proto['looks_thinkforsecs'];

proto['looks_show'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `target.visible(true);\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['looks_hide'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `target.visible(false);\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['looks_changesizeby'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const changeCode = this.valueToCode(block, 'CHANGE', this.ORDER_NONE) || '10';
  code += `targetUtils.addSize(target, ${changeCode});\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['looks_setsizeto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const sizeCode = this.valueToCode(block, 'SIZE', this.ORDER_NONE) || '100';
  code += `targetUtils.setSize(target, ${sizeCode});\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['looks_size'] = function () {
  return [`target.getAttr('scaleSize')`, this.ORDER_FUNCTION_CALL];
};

proto['looks_costume'] = function (block) {
  const code = this.quote_(block.getFieldValue('COSTUME'));
  return [code, this.ORDER_ATOMIC];
};

proto['looks_switchcostumeto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const costumeCode = this.valueToCode(block, 'COSTUME', this.ORDER_NONE) || '1';
  code += `targetUtils.switchFrameTo(target, signal, ${costumeCode});\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['looks_nextcostume'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `targetUtils.nextFrame(target, signal);\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['looks_backdrops'] = function (block) {
  const code = this.quote_(block.getFieldValue('BACKDROP'));
  return [code, this.ORDER_ATOMIC];
};

proto['looks_switchbackdropto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const backdropCode = this.valueToCode(block, 'BACKDROP', this.ORDER_NONE) || '1';
  code += `targetUtils.switchFrameTo(stage, signal, ${backdropCode}, true);\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['looks_nextbackdrop'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `targetUtils.nextFrame(stage, signal, true);\n`;
  code += 'renderMode = true;\n';
  return code;
};

proto['looks_gotofrontback'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  if (block.getFieldValue('FRONT_BACK') === 'back') {
    code += 'target.moveToBottom();\n';
  } else {
    code += 'target.moveToTop();\n';
  }
  code += 'renderMode = true;\n';
  return code;
};

proto['looks_goforwardbackwardlayers'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const forwardOrBackwardValue = block.getFieldValue('FORWARD_BACKWARD');
  const changeCode = this.valueToCode(block, 'NUM', this.ORDER_NONE);
  if (block.getFieldValue('FORWARD_BACKWARD') === 'backward') {
    code += `targetUtils.backward(target, ${changeCode});\n`;
  } else {
    code += `targetUtils.forward(target, ${changeCode});\n`;
  }
  code += 'renderMode = true;\n';
  return code;
};

proto['looks_backdropnumbername'] = function (block) {
  const numberOrNameValue = this.quote_(block.getFieldValue('NUMBER_NAME'));
  const code = `targetUtils.getFrameSerialOrName(stage, ${numberOrNameValue})`;
  return [code, this.ORDER_FUNCTION_CALL];
};

proto['looks_costumenumbername'] = function (block) {
  const numberOrNameValue = this.quote_(block.getFieldValue('NUMBER_NAME'));
  const code = `targetUtils.getFrameSerialOrName(target, ${numberOrNameValue})`;
  return [code, this.ORDER_FUNCTION_CALL];
};

proto['looks_switchbackdroptoandwait'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const backdropCode = this.valueToCode(block, 'BACKDROP', this.ORDER_NONE) || '1';
  code += `await targetUtils.switchFrameTo(stage, signal, ${backdropCode}, true);\n`;
  code += 'renderMode = true;\n';
  return code;
};
