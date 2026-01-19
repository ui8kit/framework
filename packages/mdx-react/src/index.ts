// =============================================================================
// @ui8kit/mdx-react
// =============================================================================
// MDX processing package for UI8Kit documentation
//
// This package provides:
// - MDX to React compilation
// - Frontmatter and TOC extraction
// - Docs tree scanning for navigation
// - React hooks for page content access
// - Static HTML generator for build time
// =============================================================================

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

export { defineConfig, loadConfig, resolveConfigPath } from './config'

// -----------------------------------------------------------------------------
// Types
// -----------------------------------------------------------------------------

export type {
  // Config types
  MdxConfig,
  SiteConfig,
  MdxCompilerOptions,
  TocConfig,
  SidebarItem,
  
  // Page content types
  Frontmatter,
  TocEntry,
  PageData,
  PageContent,
  
  // Docs tree types
  DocsTreeEntry,
  
  // Generator types
  GeneratorOptions,
  GeneratedPage,
  
  // Vite plugin types
  VitePluginOptions,
} from './types'

// -----------------------------------------------------------------------------
// React Context & Hooks
// -----------------------------------------------------------------------------

export {
  PageContentProvider,
  usePageContent,
  useToc,
  useFrontmatter,
  type PageContentProviderProps,
} from './context'

// -----------------------------------------------------------------------------
// Re-export MDX utilities from @mdx-js
// -----------------------------------------------------------------------------

export { compile as compileMDX } from '@mdx-js/mdx'
export { MDXProvider, useMDXComponents } from '@mdx-js/react'

// -----------------------------------------------------------------------------
// Components (documentation helpers)
// -----------------------------------------------------------------------------

export { ComponentExample } from './components/ComponentExample'
export type { ComponentExampleProps } from './components/ComponentExample'
