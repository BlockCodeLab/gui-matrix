import { javascriptGenerator } from './generator';

const AWAIT_ABORT = 'if (abort || !runtime.running) break;\n';

javascriptGenerator['sound_sounds_menu'] = (block) => {
  return [block.getFieldValue('SOUND_MENU'), javascriptGenerator.ORDER_ATOMIC];
};

javascriptGenerator['sound_play'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  const soundCode = javascriptGenerator.valueToCode(block, 'SOUND_MENU', javascriptGenerator.ORDER_NONE) || 'SILENT';
  code += `runtime.playWave('${soundCode}')\n`;
  return code;
};

javascriptGenerator['sound_playuntildone'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }

  const soundCode = javascriptGenerator.valueToCode(block, 'SOUND_MENU', javascriptGenerator.ORDER_NONE) || 'SILENT';
  code += `await runtime.playWave('${soundCode}')\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['sound_stopallsounds'] = (block) => {
  let code = '';
  if (javascriptGenerator.STATEMENT_PREFIX) {
    code += javascriptGenerator.injectId(javascriptGenerator.STATEMENT_PREFIX, block);
  }
  code += `await runtime.pauseAllWaves()\n${AWAIT_ABORT}`;
  return code;
};

javascriptGenerator['sound_changevolumeby'] = () => '';

javascriptGenerator['sound_setvolumeto'] = () => '';

javascriptGenerator['sound_volume'] = () => '';
