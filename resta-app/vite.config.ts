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
    },
  },
});
