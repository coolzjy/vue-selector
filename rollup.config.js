import npm from 'rollup-plugin-node-resolve'
import cjs from 'rollup-plugin-commonjs'

export default {
  entry: 'src/index.js',
  format: 'umd',
  moduleName: 'VueSelector',
  plugins: [ npm(), cjs() ],
  dest: 'dist/vue-selector.js'
};
