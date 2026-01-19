import type { MdxConfig } from './core/types'

/**
 * Define MDX configuration with type safety
 * 
 * @example
 * ```ts
 * // mdx.config.ts
 * import { defineConfig } from '@ui8kit/mdx-react'
 * 
 * export default defineConfig({
 *   docsDir: './docs',
 *   outputDir: './dist/docs',
 *   components: {
 *     Button: '@/components/ui/Button',
 *   }
 * })
 * ```
 */
export function defineConfig(config: MdxConfig): MdxConfig {
  return {
    // Defaults
    basePath: '/docs',
    outputDir: './dist/docs',
    sidebar: 'auto',
    sidebarSort: 'frontmatter',
    // User overrides
    ...config,
    // Deep merge nested objects
    toc: {
      minLevel: 2,
      maxLevel: 3,
      ...config.toc,
    },
    mdx: {
      gfm: true,
      remarkPlugins: [],
      rehypePlugins: [],
      ...config.mdx,
    },
    site: {
      lang: 'en',
      ...config.site,
    },
  }
}
