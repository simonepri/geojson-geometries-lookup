import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import strip from '@rollup/plugin-strip';
import { terser } from "rollup-plugin-terser";

export default {
  input: 'index.js',
  output: {
    file: 'browser.js',
    format: 'iife',
    name: 'GeoJsonGeometriesLookup'
  },
  plugins: [nodeResolve({ browser: true }), commonjs(), strip(), terser()]
};