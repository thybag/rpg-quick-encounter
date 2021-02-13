import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'; // Leaflet
import css from 'rollup-plugin-import-css';


export default {
  input: 'src/index.js',
  output: {
    file: 'dist/encounter.js',
    format: 'iife'
  },
  plugins: [
	  nodeResolve(),
	  commonjs(),
	  css({
	  	output: 'encounter.css',
	  	alwaysOutput:true
	  })
  ]
};