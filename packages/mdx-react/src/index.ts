// =============================================================================
// @ui8kit/mdx-react
// =============================================================================
// MDX processing package for UI8Kit documentation
//
// This package provides:
// - MDX to React compilation (dev mode)
// - MDX to Liquid/HTML generation (build mode)
// - Documentation components (ComponentPreview, PropsTable, etc.)
// - Props extraction from TypeScript
// - Navigation generation for sidebars
// =============================================================================

// -----------------------------------------------------------------------------
// Configuration
// -----------------------------------------------------------------------------

export { defineConfig, loadConfig, resolveConfigPath } from './config'

// -----------------------------------------------------------------------------
// Types
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
// Documentation Components
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
// Core Utilities
// -----------------------------------------------------------------------------

export {
  parseFrontmatter,
  extractToc,
  buildHierarchicalToc,
  extractExcerpt,
  parseMdxFile,
} from './core/parser'

export {
  scanDocsTree,
  flattenDocsTree,
  buildSidebarFromTree,
} from './core/scanner'

export { slugify, uniqueSlug } from './core/slugify'

// -----------------------------------------------------------------------------
// Re-export MDX utilities from @mdx-js
// -----------------------------------------------------------------------------

export { compile as compileMDX } from '@mdx-js/mdx'
export { MDXProvider, useMDXComponents } from '@mdx-js/react'
