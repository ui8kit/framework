import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import mdx from '@mdx-js/rollup'
import path from 'path'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import type { Plugin } from 'vite'

/**
 * Custom plugin to extract TOC from MDX and inject as export
 * Runs AFTER MDX compilation
 */
function mdxTocPlugin(): Plugin {
  return {
    name: 'mdx-toc',
    enforce: 'post', // Run after MDX plugin
    transform(code: string, id: string) {
      // Only process compiled MDX modules
      if (!id.endsWith('.mdx') && !id.endsWith('.mdx?import')) return null
      
      // Check if this is already compiled (has jsx imports)
      if (!code.includes('jsxDEV') && !code.includes('jsx(')) return null
      
      // Extract headings for TOC from the original file content
      // We'll inject a static toc export
      const headingMatches = code.matchAll(/_components\.h([2-3]),\s*\{\s*id:\s*"([^"]+)"[^}]*children:\s*"([^"]+)"/g)
      const toc: Array<{ depth: number; text: string; slug: string }> = []
      
      for (const match of headingMatches) {
        toc.push({
          depth: parseInt(match[1], 10),
          text: match[3],
          slug: match[2],
        })
      }
      
      // Inject toc export if not already present
      if (!code.includes('export const toc') && toc.length > 0) {
        const tocExport = `export const toc = ${JSON.stringify(toc)};\n`
        return tocExport + code
      }
      
      // If no TOC found, still export empty array
      if (!code.includes('export const toc')) {
        return `export const toc = [];\n` + code
      }
      
      return null
    },
  }
}

export default defineConfig({
  plugins: [
    // IMPORTANT: MDX plugin MUST come BEFORE react plugin
    // and must use enforce: 'pre' to process .mdx files first
    {
      ...mdx({
        remarkPlugins: [
          remarkGfm,
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
        ],
        rehypePlugins: [
          rehypeSlug, // Add id attributes to headings
        ],
        providerImportSource: '@mdx-js/react',
      }),
      enforce: 'pre', // Process MDX before other plugins
    },
    mdxTocPlugin(),
    react(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ui8kit/core': path.resolve(__dirname, './src/components/index'),
      '@ui8kit/mdx-react': path.resolve(__dirname, '../../packages/mdx-react/src'),
    },
  },
})
