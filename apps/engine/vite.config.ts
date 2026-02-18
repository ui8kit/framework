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
      '@ui8kit/template': resolve(__dirname, '../../packages/template/src/index.ts'),
    },
  },
});
