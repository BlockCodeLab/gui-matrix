import { javascriptGenerator } from './generator';

javascriptGenerator['sound_sounds_menu'] = function (block) {
  return [block.getFieldValue('SOUND_MENU'), this.ORDER_ATOMIC];
};

javascriptGenerator['sound_play'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const soundCode = this.valueToCode(block, 'SOUND_MENU', this.ORDER_NONE) || 'SILENT';
  code += `runtime.playWave('${soundCode}')\n`;
  return code;
};

javascriptGenerator['sound_playuntildone'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }

  const soundCode = this.valueToCode(block, 'SOUND_MENU', this.ORDER_NONE) || 'SILENT';
  code += this.wrapAsync(`runtime.playWave('${soundCode}')`);
  return code;
};

javascriptGenerator['sound_stopallsounds'] = function (block) {
  let code = '';
  if (this.STATEMENT_PREFIX) {
    code += this.injectId(this.STATEMENT_PREFIX, block);
  }
  code += this.wrapAsync(`runtime.pauseAllWaves()`);
  return code;
};

javascriptGenerator['sound_changevolumeby'] = () => '';

javascriptGenerator['sound_setvolumeto'] = () => '';

javascriptGenerator['sound_volume'] = () => '';
