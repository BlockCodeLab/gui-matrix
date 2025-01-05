import { resolve } from 'node:path';
import copy from 'bun-copy-plugin';

const projectDir = import.meta.dir;
const srcDir = resolve(projectDir, 'src');
const distDir = resolve(projectDir, 'dist');
const publicDir = resolve(projectDir, 'public');

export default {
  entrypoints: [resolve(srcDir, 'index.jsx'), resolve(srcDir, 'info.jsx')],
  outdir: distDir,
  plugins: [copy(`${publicDir}/`, resolve(distDir, 'assets'))],
};
