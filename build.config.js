import { resolve } from 'node:path';
import CSSLoader from 'bun-loader-css';
import YamlLoader from 'bun-loader-yaml';
import CopyPlugin from 'bun-plugin-copy';

const isRelease = Bun.env.BUN_ENV === 'production';

const PROJECT_ROOT = import.meta.dir;
const SRC_DIR = resolve(PROJECT_ROOT, 'src');
const DIST_DIR = resolve(PROJECT_ROOT, 'dist');

export default {
  entrypoints: [resolve(SRC_DIR, 'index.jsx'), resolve(SRC_DIR, 'app.jsx')],
  root: SRC_DIR,
  outdir: DIST_DIR,
  minify: isRelease,
  naming: {
    asset: 'assets/[name]-[hash].[ext]',
  },
  plugins: [
    CSSLoader(),
    YamlLoader(),
    CopyPlugin({
      from: './public',
      to: 'assets/',
    }),
  ],
  define: {
    DEVELOPMENT: JSON.stringify(Bun.env.BUN_ENV !== 'production'),
    JOYSTICK: JSON.stringify(['no', 'off', 'disable'].indexOf(`${Bun.env.JOYSTICK}`.toLowerCase()) === -1),
  },
  external: [
    'preact',
    'preact/hooks',
    `preact/jsx-${isRelease ? '' : 'dev-'}runtime`,
    '@blockcode/core',
    '@blockcode/ui',
    '@blockcode/blocks-editor',
    '@blockcode/blocks-player',
    '@blockcode/tone-player',
    '@blockcode/workspace-blocks',
    '@blockcode/pixel-paint',
    '@blockcode/wave-surfer',
  ],
};
