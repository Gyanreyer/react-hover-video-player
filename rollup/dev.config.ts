import replace from '@rollup/plugin-replace';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import html from '@rollup/plugin-html';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  input: 'dev/index.tsx',
  output: {
    file: 'dev/build/bundle.js',
    format: 'iife',
    exports: 'default',
    name: 'HoverVideoPlayer_DevPlayground',
  },
  plugins: [
    replace({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      preventAssignment: true,
    }),
    resolve(),
    commonjs(),
    typescript({
      tsconfigOverride: {
        compilerOptions: { declaration: false },
      },
      check: false,
    }),
    html({}),
    serve({
      port: 3000,
      contentBase: 'dev/build',
    }),
    livereload(),
  ],
};
