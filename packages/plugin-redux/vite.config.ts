import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';
import packageJson from './package.json';

export default defineConfig((env) => ({
  build: {
    lib: {
      entry: './src',
      fileName: '[name]',
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        preserveModules: true,
      },
      external: Object.keys(packageJson.peerDependencies)
        .map((dep) => new RegExp('^' + dep)),
    },
  },
  plugins: [
    dts(),
  ],
}));
