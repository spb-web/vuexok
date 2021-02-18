import typescript from '@rollup/plugin-typescript'
import { terser } from 'rollup-plugin-terser'

export default {
  input: [
    './src/vuexok.ts',
    './src/vuexokWorkerGetActions.ts',
    './src/vuexokWorkerWrapper.ts',
  ],
  output: [
    { 
      dir: './dist',
      format: 'cjs',
    },
  ],
  plugins: [
    typescript({
      tsconfig: './tsconfig.json',
      declarationDir: './dist',
      declaration: true,
    }),
    terser({
      ie8: false,
      module: true,
      compress: {
        passes: 2,
      }
    }),
  ],
}
