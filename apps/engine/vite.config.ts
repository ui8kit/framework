import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@ui8kit/core': resolve(__dirname, '../../packages/core/src/index.ts'),
      '@ui8kit/template': resolve(__dirname, '../../packages/template/src/index.ts'),
      '@ui8kit/blocks': resolve(__dirname, '../../packages/blocks/src/index.ts'),
      '@ui8kit/data': resolve(__dirname, '../../packages/data/src/index.ts'),
    },
  },
});
