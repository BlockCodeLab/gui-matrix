const generate = (file, index) => `(() => {
const stage = runtime.stage;
${index > 0 ? `const target = runtime.getSpriteByIdOrName('${file.id}');` : 'const target = stage;'}
${file.script || ''}})();
`;

export default (fileList) => `${fileList.map(generate).join('\n')}
runtime.start();`;
