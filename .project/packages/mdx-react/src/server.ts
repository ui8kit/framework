// =============================================================================
// @ui8kit/mdx-react/server - Node.js-only exports
// =============================================================================
// This module contains Node.js-specific code that requires:
// - File system access (fs, path)
// - Dynamic imports
// - SSR/build-time functionality
//
// DO NOT import this in browser code!
// =============================================================================

import type { MdxConfig } from './core/types'
import { defineConfig } from './config'

// -----------------------------------------------------------------------------
// Config Loading (Node.js only - uses dynamic import)
// -----------------------------------------------------------------------------

/**
 * Load MDX config from file path
 * Used by generator and build scripts
 * 
 * @note This function uses dynamic import and is NOT browser-safe
 */
export async function loadConfig(configPath: string): Promise<MdxConfig> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const module = await import(/* @vite-ignore */ configPath)
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

// -----------------------------------------------------------------------------
// Scanner (Node.js only - uses fs)
// -----------------------------------------------------------------------------

export {
  scanDocsTree,
  flattenDocsTree,
  buildSidebarFromTree,
} from './core/scanner'

// -----------------------------------------------------------------------------
// Generator (Node.js only)
// -----------------------------------------------------------------------------

export { generateDocsFromMdx } from './generator'

// -----------------------------------------------------------------------------
// Re-export types for convenience
// -----------------------------------------------------------------------------

export type {
  MdxGeneratorConfig,
  MdxConfig,
  DocsTreeEntry,
  NavItem,
  DocsNavigation,
  Frontmatter,
  TocEntry,
  GeneratedMdxPage,
  GeneratedDemo,
} from './core/types'

// Re-export defineConfig for completeness
export { defineConfig } from './config'
