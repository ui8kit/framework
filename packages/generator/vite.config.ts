import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  plugins: [
    dts({
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.spec.ts', 'test/**/*'],
      rollupTypes: true,
      insertTypesEntry: true,
    }),
  ],
  
  build: {
    // Library mode configuration
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'UI8KitGenerator',
      formats: ['es'],
      fileName: (format) => `index.js`,
    },
    
    // Output directory
    outDir: 'dist',
    
    // Empty output directory before build
    emptyOutDir: true,
    
    // Generate source maps for debugging
    sourcemap: true,
    
    // Target Node.js environment
    target: 'node18',
    
    // Rollup options
    rollupOptions: {
      // External dependencies (don't bundle these)
      external: [
        // Node.js built-ins
        'node:fs',
        'node:fs/promises',
        'node:path',
        'node:url',
        'node:crypto',
        'node:stream',
        'node:util',
        'node:events',
        'node:buffer',
        'node:child_process',
        'fs',
        'fs/promises',
        'path',
        'url',
        'crypto',
        'stream',
        'util',
        'events',
        'buffer',
        'child_process',
        
        // Peer dependencies
        'react',
        'react-dom',
        'react/jsx-runtime',
        
        // Dependencies (should be installed by consumer)
        'glob',
        'liquidjs',
        'uncss',
        'typescript',
        
        // Workspace packages
        '@ui8kit/render',
        '@ui8kit/mdx-react',
      ],
      
      output: {
        // Preserve module structure
        preserveModules: true,
        preserveModulesRoot: 'src',
        
        // Entry file names
        entryFileNames: '[name].js',
        
        // Chunk file names
        chunkFileNames: '[name].js',
        
        // Export format
        format: 'es',
        
        // Interop settings
        interop: 'auto',
        
        // Exports mode
        exports: 'named',
      },
    },
    
    // Minification (disabled for library - consumers can minify)
    minify: false,
    
    // Report compressed size
    reportCompressedSize: false,
  },
  
  // Resolve aliases (match tsconfig paths)
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});
