// =============================================================================
// @ui8kit/mdx-react - Browser-safe exports
// =============================================================================
// MDX processing package for UI8Kit documentation
//
// This is the main entry point with BROWSER-SAFE exports only.
// For Node.js-only features (scanner, generator), use:
//   import { ... } from '@ui8kit/mdx-react/server'
// =============================================================================

// -----------------------------------------------------------------------------
// Types (always safe)
// -----------------------------------------------------------------------------

export type {
  // Generator config (for generator.config.ts)
  MdxGeneratorConfig,
  
  // Standalone config (for mdx.config.ts)
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
  NavItem,
  DocsNavigation,
  
  // Component props types
  PropDefinition,
  ComponentPropsData,
  
  // Generator types
  GeneratedMdxPage,
  GeneratedDemo,
  
  // Vite plugin types
  VitePluginOptions,
} from './core/types'

// -----------------------------------------------------------------------------
// React Context & Hooks (browser-safe)
// -----------------------------------------------------------------------------

export {
  PageContentProvider,
  usePageContent,
  useToc,
  useFrontmatter,
  type PageContentProviderProps,
} from './context'

// -----------------------------------------------------------------------------
// Documentation Components (browser-safe)
// -----------------------------------------------------------------------------

export {
  ComponentPreview,
  PropsTable,
  Callout,
  Steps,
  type ComponentPreviewProps,
  type PropsTableProps,
  type CalloutProps,
  type StepsProps,
} from './components'

// Legacy export
export { ComponentExample, type ComponentExampleProps } from './components'

// -----------------------------------------------------------------------------
// Core Parsing Utilities (browser-safe - no fs operations)
// -----------------------------------------------------------------------------

export {
  parseFrontmatter,
  extractToc,
  buildHierarchicalToc,
  extractExcerpt,
  parseMdxFile,
} from './core/parser'

export { slugify, uniqueSlug } from './core/slugify'

// -----------------------------------------------------------------------------
// Configuration Helper (browser-safe - type only)
// -----------------------------------------------------------------------------

export { defineConfig } from './config'

// -----------------------------------------------------------------------------
// Re-export MDX utilities from @mdx-js (optional peer deps)
// -----------------------------------------------------------------------------

// Note: These are re-exported for convenience but require @mdx-js/mdx and @mdx-js/react
// to be installed as peer dependencies
export { MDXProvider, useMDXComponents } from '@mdx-js/react'
