import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3010,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@ui8kit/core': resolve(__dirname, './src/components/index.ts'),
      '@ui8kit/dsl': resolve(__dirname, '../../packages/dsl/src/index.ts'),
      '@ui8kit/contracts': resolve(__dirname, '../../packages/contracts/src/index.ts'),
      '@ui8kit/sdk': resolve(__dirname, '../../packages/sdk/src/index.ts')
    },
  },
});
