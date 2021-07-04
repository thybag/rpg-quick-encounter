import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs'; // Leaflet
import scss from 'rollup-plugin-scss'


export default {
  input: 'src/index.js',
  output: {
    file: 'dist/encounter.js',
    format: 'iife'
  },
  plugins: [
	  nodeResolve(),
	  commonjs(),
	  scss({
	  	output: 'dist/encounter.css'
	  })
  ]
};