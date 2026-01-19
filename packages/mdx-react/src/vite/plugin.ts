import type { Plugin } from 'vite'
import type { VitePluginOptions } from '../core/types'

/**
 * Vite plugin for MDX documentation development
 * 
 * This is a thin wrapper that configures @mdx-js/rollup
 * with recommended settings for UI8Kit documentation.
 * 
 * @example
 * ```ts
 * // vite.config.ts
 * import { mdxPlugin } from '@ui8kit/mdx-react/vite'
 * 
 * export default {
 *   plugins: [
 *     mdxPlugin(),
 *     react(),
 *   ]
 * }
 * ```
 */
export function mdxPlugin(options: VitePluginOptions = {}): Plugin[] {
  const { docsDir = './docs' } = options
  
  return [
    // Pre-configured MDX plugin
    {
      name: 'ui8kit-mdx-pre',
      enforce: 'pre',
      
      async config() {
        // Dynamically import MDX plugin to avoid bundling issues
        const mdx = await import('@mdx-js/rollup')
        const remarkFrontmatter = await import('remark-frontmatter')
        const remarkMdxFrontmatter = await import('remark-mdx-frontmatter')
        const remarkGfm = await import('remark-gfm')
        const rehypeSlug = await import('rehype-slug')
        
        return {
          plugins: [
            {
              ...mdx.default({
                remarkPlugins: [
                  remarkGfm.default,
                  remarkFrontmatter.default,
                  [remarkMdxFrontmatter.default, { name: 'frontmatter' }],
                ],
                rehypePlugins: [
                  rehypeSlug.default,
                ],
                providerImportSource: '@mdx-js/react',
              }),
              enforce: 'pre',
            },
          ],
        }
      },
    },
    
    // TOC extraction plugin
    {
      name: 'ui8kit-mdx-toc',
      enforce: 'post',
      
      transform(code: string, id: string) {
        // Only process MDX files
        if (!id.endsWith('.mdx')) return null
        
        // Check if compiled (has jsx)
        if (!code.includes('jsxDEV') && !code.includes('jsx(')) return null
        
        // Extract TOC if not already present
        if (code.includes('export const toc')) return null
        
        // Try to extract headings from compiled output
        const toc = extractTocFromCompiled(code)
        
        return `export const toc = ${JSON.stringify(toc)};\n${code}`
      },
    },
  ]
}

/**
 * Extract TOC from compiled MDX code
 */
function extractTocFromCompiled(code: string): Array<{ depth: number; text: string; slug: string }> {
  const toc: Array<{ depth: number; text: string; slug: string }> = []
  
  // Match heading elements in compiled output
  // Pattern: _components.h2, { id: "slug", children: "text" }
  const headingRegex = /_components\.h([2-3]),\s*\{\s*id:\s*"([^"]+)"[^}]*children:\s*"([^"]+)"/g
  
  let match
  while ((match = headingRegex.exec(code)) !== null) {
    toc.push({
      depth: parseInt(match[1], 10),
      text: match[3],
      slug: match[2],
    })
  }
  
  return toc
}

export default mdxPlugin
