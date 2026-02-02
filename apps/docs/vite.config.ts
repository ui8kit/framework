import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mdx from '@mdx-js/rollup'
import path from 'path'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'

export default defineConfig({
  plugins: [
    // MDX plugin with pre enforce
    {
      ...mdx({
        remarkPlugins: [
          remarkGfm,
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
        ],
        rehypePlugins: [
          rehypeSlug,
        ],
        providerImportSource: '@mdx-js/react',
      }),
      enforce: 'pre',
    },
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui8kit/core': path.resolve(__dirname, '../../packages/core/src/index'),
      // Point to browser-safe index (no fs, no scanner)
      '@ui8kit/mdx-react': path.resolve(__dirname, '../../packages/mdx-react/src/index.ts'),
    },
  },
  optimizeDeps: {
    // Exclude server-only modules from browser bundling
    exclude: ['@ui8kit/mdx-react/server'],
  },
})
