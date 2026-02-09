import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@ui8kit/core': path.resolve(__dirname, '../../packages/core/src/index.ts'),
      '@ui8kit/template': path.resolve(__dirname, '../../packages/template/src/index.ts'),
      '@ui8kit/data': path.resolve(__dirname, '../../packages/data/src/index.ts'),
      '@ui8kit/blocks': path.resolve(__dirname, '../../packages/blocks/src/index.ts')
    }
  },
})


