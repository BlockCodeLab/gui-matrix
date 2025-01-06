import { MatrixemuGenerator } from './generator';

const proto = MatrixemuGenerator.prototype;

proto['sound_sounds_menu'] = function (block) {
  return [this.quote_(block.getFieldValue('SOUND_MENU')), this.ORDER_ATOMIC];
};

proto['sound_play'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const soundCode = this.valueToCode(block, 'SOUND_MENU', this.ORDER_NONE) || '""';
  code += `await runtime.playWave(${soundCode});\n`;
  return code;
};

proto['sound_playuntildone'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  const soundCode = this.valueToCode(block, 'SOUND_MENU', this.ORDER_NONE) || '""';
  code += `await runtime.playWave(${soundCode}, true);\n`;
  return code;
};

proto['sound_stopallsounds'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += 'runtime.stopAllWaves();\n';
  return code;
};
