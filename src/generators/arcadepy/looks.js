import { ArcadepyGenerator } from './generator';

const proto = ArcadepyGenerator.prototype;

proto['looks_sayforsecs'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const optionValue = block.getFieldValue('OPTION') || 'say';
  const msgCode = this.valueToCode(block, 'MESSAGE', this.ORDER_NONE) || '""';
  const secCode = this.valueToCode(block, 'SECS', this.ORDER_NONE) || '2';

  code += `await target.say_wait(str(${msgCode}), num(${secCode}), ${optionValue === 'shout' ? 16 : 12})\n`;
  code += 'render_mode = True\n';
  return code;
};

proto['looks_say'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const optionValue = block.getFieldValue('OPTION') || 'say';
  const msgCode = this.valueToCode(block, 'MESSAGE', this.ORDER_NONE) || '""';

  code += `target.say(str(${msgCode}, ${optionValue === 'shout' ? 16 : 12}))\n`;
  code += 'render_mode = True\n';
  return code;
};

proto['looks_thinkforsecs'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const optionValue = block.getFieldValue('OPTION') || 'think';
  const msgCode = this.valueToCode(block, 'MESSAGE', this.ORDER_NONE) || '""';
  const secCode = this.valueToCode(block, 'SECS', this.ORDER_NONE) || '2';

  code += `await target.think_wait(str(${msgCode}), num(${secCode}), ${optionValue === 'spark' ? 16 : 12})\n`;
  code += 'render_mode = True\n';
  return code;
};

proto['looks_think'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const optionValue = block.getFieldValue('OPTION') || 'think';
  const msgCode = this.valueToCode(block, 'MESSAGE', this.ORDER_NONE) || '""';

  code += `target.think(str(${msgCode}), ${optionValue === 'spark' ? 16 : 12})\n`;
  code += 'render_mode = True\n';
  return code;
};

proto['looks_show'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `target.hidden = False\n`;
  code += 'render_mode = True\n';
  return code;
};

proto['looks_hide'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `target.hidden = True\n`;
  code += 'render_mode = True\n';
  return code;
};

proto['looks_changesizeby'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const changeCode = this.valueToCode(block, 'CHANGE', this.ORDER_NONE) || 10;
  code += `target.size += num(${changeCode})\n`;
  code += 'render_mode = True\n';
  return code;
};

proto['looks_setsizeto'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const sizeCode = this.valueToCode(block, 'SIZE', this.ORDER_NONE) || 100;
  code += `target.size = num(${sizeCode})\n`;
  code += 'render_mode = True\n';
  return code;
};

proto['looks_size'] = function () {
  return ['target.size', this.ORDER_MEMBER];
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
  const costumeCode = this.valueToCode(block, 'COSTUME', this.ORDER_NONE) || '""';
  code += `target.frame_name = ${costumeCode}\n`;
  code += 'render_mode = True\n';
  return code;
};

proto['looks_nextcostume'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `target.frame_number += 1\n`;
  code += 'render_mode = True\n';
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
  const backdropCode = this.valueToCode(block, 'BACKDROP', this.ORDER_NONE) || '""';
  code += `stage.frame_name = ${backdropCode}\n`;
  code += 'render_mode = True\n';
  code += `runtime.backdropswitchesto(${backdropCode})\n`;
  return code;
};

proto['looks_nextbackdrop'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `stage.frame_number += 1\n`;
  code += 'render_mode = True\n';
  return code;
};

proto['looks_gotofrontback'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const frontOrBackValue = block.getFieldValue('FRONT_BACK');
  code += `target.go_${frontOrBackValue}()\n`;
  code += 'render_mode = True\n';
  return code;
};

proto['looks_goforwardbackwardlayers'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const forwardOrBackwardValue = block.getFieldValue('FORWARD_BACKWARD');
  const changeCode = this.valueToCode(block, 'NUM', this.ORDER_NONE);
  code += `target.z_index ${forwardOrBackwardValue === 'backward' ? '-' : '+'}= num(${changeCode})\n`;
  code += 'render_mode = True\n';
  return code;
};

proto['looks_backdropnumbername'] = function (block) {
  const numberOrNameValue = block.getFieldValue('NUMBER_NAME');
  const code = numberOrNameValue === 'name' ? 'stage.frame_name' : 'stage.frame_number';
  return [code, this.ORDER_MEMBER];
};

proto['looks_costumenumbername'] = function (block) {
  const numberOrNameValue = block.getFieldValue('NUMBER_NAME');
  const code = numberOrNameValue === 'name' ? 'target.frame_name' : 'target.frame_number';
  return [code, this.ORDER_MEMBER];
};

proto['looks_switchbackdroptoandwait'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const backdropCode = this.valueToCode(block, 'BACKDROP', this.ORDER_NONE) || '""';
  code += `stage.frame_name = ${backdropCode}\n`;
  code += 'render_mode = True\n';
  code += `await runtime.backdropswitchesto(${backdropCode}, waiting=True)\n`;
  return code;
};
