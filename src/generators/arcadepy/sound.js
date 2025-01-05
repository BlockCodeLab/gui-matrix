import { ArcadepyGenerator } from './generator';

const proto = ArcadepyGenerator.prototype;

proto['sound_sounds_menu'] = function (block) {
  return [block.getFieldValue('SOUND_MENU'), this.ORDER_ATOMIC];
};

proto['sound_play'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const soundCode = this.valueToCode(block, 'SOUND_MENU', this.ORDER_NONE) || '';
  code += `runtime.play_sound(__file__, "${soundCode}")\n`;
  return code;
};

proto['sound_playuntildone'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const soundCode = this.valueToCode(block, 'SOUND_MENU', this.ORDER_NONE) || '';
  code += `await runtime.play_sound_wait(__file__, "${soundCode}")\n`;
  return code;
};

proto['sound_stopallsounds'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += `runtime.stop_sound()\n`;
  return code;
};
