import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
//import dts from 'rollup-plugin-dts';
import pkg from './package.json';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'es',
      sourcemap: false,
      plugins: [ terser(), ],
    },
    {
      name: "ResizingSVG",
      file: pkg.browser,
      format: 'iife',
      sourcemap: false,
      plugins: [ terser(), ],
    },
  ],
  plugins: [
    typescript({tsconfig: './tsconfig.json'}),
    resolve(),
    commonjs(),
  ],
  watch: {
    include: 'src/**/*',
  },
};

