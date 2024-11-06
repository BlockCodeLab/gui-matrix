import { resolve } from 'node:path';
import CSSLoader from 'bun-loader-css';
import YamlLoader from 'bun-loader-yaml';
import CopyPlugin from 'bun-plugin-copy';

const PROJECT_ROOT = import.meta.dir;
const SRC_DIR = resolve(PROJECT_ROOT, 'src');
const DIST_DIR = resolve(PROJECT_ROOT, 'dist');

const checkEnvOn = (env) => ['yes', 'on', 'enable'].indexOf(`${env}`.toLowerCase()) !== -1;
const checkEnvOff = (env) => ['no', 'off', 'disable'].indexOf(`${env}`.toLowerCase()) === -1;

const isRelease = Bun.env.BUN_ENV === 'production';
const isIdeal = checkEnvOn(Bun.env.IDEAL);

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
  ].concat(
    isIdeal
      ? CopyPlugin({
          from: './ideal',
          to: 'assets/',
        })
      : [],
  ),
  define: {
    DEVELOPMENT: JSON.stringify(Bun.env.BUN_ENV !== 'production'),
    IDEAL: JSON.stringify(isIdeal), // default off
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
