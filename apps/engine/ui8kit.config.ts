import { defineApp } from '@ui8kit/sdk/source/config';

export default defineApp({
  $schema: 'https://ui.buildy.tw/schema.json',
  brand: 'ui8kit',
  framework: 'vite-react',
  typescript: true,
  target: 'react',
  outDir: './dist/react',
  aliases: {
    '@': './src',
    '@/components': './src/components',
    '@/ui': './src/components/ui',
    '@/layouts': './src/layouts',
    '@/blocks': './src/blocks',
    '@/lib': './src/lib',
    '@/variants': './src/variants',
  },
  fixtures: './fixtures',
  tokens: './src/css/shadcn.css',
  componentsDir: './src/components',
  blocksDir: './src/blocks',
  layoutsDir: './src/layouts',
  partialsDir: './src/partials',
  libDir: './src/lib',
  registry: '@ui8kit',
  lint: {
    strict: true,
    dsl: true,
  },
});
