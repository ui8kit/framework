import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3020,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@ui8kit/core': resolve(__dirname, '../packages/core/src/index.ts'),
      '@ui8kit/template': resolve(__dirname, '../packages/template/src/index.ts'),
      '@ui8kit/blocks': resolve(__dirname, '../packages/blocks/src/index.ts'),
      '@ui8kit/data-contracts': resolve(__dirname, '../packages/data-contracts/src/index.ts'),
      '@ui8kit/sdk/source/data': resolve(__dirname, '../packages/sdk/src/data.ts'),
    },
  },
});
