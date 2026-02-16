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
export function mdxPlugin(_options: VitePluginOptions = {}): Plugin[] {
  return [
    // Pre-configured MDX plugin
    {
      name: 'ui8kit-mdx-pre',
      enforce: 'pre',
      
      config() {
        // Note: MDX plugin is configured via vite.config.ts directly
        // This is a placeholder for future expansion
        return undefined
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
