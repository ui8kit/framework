import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    dts({ include: ['src'] }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        blocks: resolve(__dirname, 'src/blocks/index.ts'),
        layouts: resolve(__dirname, 'src/layouts/index.ts'),
        partials: resolve(__dirname, 'src/partials/index.ts'),
        components: resolve(__dirname, 'src/components/index.ts'),
      },
      formats: ['es'],
      fileName: (format: string, entryName: string) => `${entryName}/index.js`,
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', '@ui8kit/core', '@ui8kit/template'],
    },
    sourcemap: true,
    minify: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@ui8kit/core': resolve(__dirname, '../../packages/core/src/index'),
      '@ui8kit/template': resolve(__dirname, '../../packages/template/src/index'),
    }
  }

});
