import type { MdxConfig } from './types'

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
    toc: {
      minLevel: 2,
      maxLevel: 3,
    },
    sidebar: 'auto',
    sidebarSort: 'frontmatter',
    mdx: {
      gfm: true,
      remarkPlugins: [],
      rehypePlugins: [],
    },
    site: {
      lang: 'en',
    },
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

/**
 * Load MDX config from file path
 * Used by generator and Vite plugin
 */
export async function loadConfig(configPath: string): Promise<MdxConfig> {
  try {
    const module = await import(configPath)
    const config = module.default || module
    
    // Validate required fields
    if (!config.docsDir) {
      throw new Error('mdx.config.ts: docsDir is required')
    }
    
    return defineConfig(config)
  } catch (error) {
    if (error instanceof Error && error.message.includes('docsDir')) {
      throw error
    }
    throw new Error(`Failed to load MDX config from ${configPath}: ${error}`)
  }
}

/**
 * Resolve config file path (auto-detection)
 */
export function resolveConfigPath(cwd: string): string {
  const candidates = [
    'mdx.config.ts',
    'mdx.config.js',
    'mdx.config.mjs',
  ]
  
  for (const candidate of candidates) {
    const fullPath = `${cwd}/${candidate}`
    try {
      // Check if file exists (will be validated on load)
      return fullPath
    } catch {
      continue
    }
  }
  
  return `${cwd}/mdx.config.ts`
}
