import { pythonGenerator } from './generator';

pythonGenerator['sound_sounds_menu'] = (block) => {
  return [block.getFieldValue('SOUND_MENU'), pythonGenerator.ORDER_ATOMIC];
};

pythonGenerator['sound_play'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const soundCode = pythonGenerator.valueToCode(block, 'SOUND_MENU', pythonGenerator.ORDER_NONE) || '';
  // code += `audio.play_sound("${soundCode}")\n`;
  return code;
};

pythonGenerator['sound_playuntildone'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  const soundCode = pythonGenerator.valueToCode(block, 'SOUND_MENU', pythonGenerator.ORDER_NONE) || '';
  // code += `await audio.play_sound_async("${soundCode}")\n`;
  return code;
};

pythonGenerator['sound_stopallsounds'] = (block) => {
  let code = '';
  if (pythonGenerator.STATEMENT_PREFIX) {
    code += pythonGenerator.injectId(pythonGenerator.STATEMENT_PREFIX, block);
  }
  // code += `audio.stop_sound()\n`;
  return code;
};
