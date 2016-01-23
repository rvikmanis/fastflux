import babel from 'rollup-plugin-babel'
import npm from 'rollup-plugin-npm'
import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-uglify'

export default {
  entry: 'src/index.js',
  plugins: [ babel(), npm({jsnext: true, main: true}), commonjs(), uglify() ],
  format: 'iife',
  moduleName: 'Fastflux',
  external: ['react'],
  globals: {
    react: 'React'
  }
}
