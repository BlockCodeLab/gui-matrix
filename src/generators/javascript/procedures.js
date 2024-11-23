import { ScratchBlocks } from '@blockcode/blocks-editor';
import { javascriptGenerator } from './generator';

javascriptGenerator['procedures_definition'] = function (block) {
  const myBlock = block.childBlocks_[0];
  const funcName = this.variableDB_.getName(myBlock.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
  const args = myBlock.childBlocks_.map((argBlock) =>
    this.variableDB_.getName(argBlock.getFieldValue('VALUE'), ScratchBlocks.Variables.NAME_TYPE),
  );
  args.push('done');
  let funcCode = `async (target, ${args.join(', ')}) => {`;
  funcCode += `${this.START_PROCESS}const flash = ${myBlock.warp_};\n`;
  funcCode += `do {\n/* code */} while (false);\ndone();\n}`;
  return `runtime.on('procedure:${funcName}', ${funcCode});\n`;
};

javascriptGenerator['procedures_call'] = function (block) {
  const funcName = this.variableDB_.getName(block.getProcCode(), ScratchBlocks.Procedures.NAME_TYPE);
  const args = block.argumentIds_.map((arg) => this.valueToCode(block, arg, this.ORDER_NONE));
  args.unshift('target');
  return this.wrapAsync(`runtime.emit('procedure:${funcName}', ${args.join(', ')})`);
};
