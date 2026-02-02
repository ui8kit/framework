import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@ui8kit/core': resolve(__dirname, '../../packages/core/src/index'),
      '@ui8kit/template': resolve(__dirname, '../../packages/template/src/index'),
    },
  },
});
