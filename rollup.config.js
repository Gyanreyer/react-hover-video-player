import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import copy from 'rollup-plugin-copy';

import packageJson from './package.json';

export default {
  input: './src/index.ts',
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'default',
    },
    {
      file: packageJson.module,
      format: 'es',
      sourcemap: true,
      exports: 'default',
    },
  ],
  plugins: [
    // Make sure the latest README file is copied into the docs folder
    // so the documentation page can work correctly
    copy({ targets: [{ src: 'README.md', dest: 'docs' }] }),
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({ useTsconfigDeclarationDir: true }),
  ],
};
