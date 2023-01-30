// rollup.config.js
import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';

export default {
    input: 'source/Meting.js',
    output: {
        file: 'dist/Meting.min.js',
        format: 'iife'
    },
    plugins: [commonjs(), resolve(), babel({ babelHelpers: 'bundled' }), terser()]
};
