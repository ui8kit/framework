import type { ComponentType } from 'react'

// ============================================================================
// Generator Config Types (for generator.config.ts)
// ============================================================================

/**
 * MDX configuration section for GeneratorConfig
 * Added to generator.config.ts under `mdx` key
 */
export interface MdxGeneratorConfig {
  /**
   * Enable MDX documentation generation
   */
  enabled: boolean

  /**
   * Directory containing MDX documentation files
   * Relative to config file location
   * @example './docs'
   */
  docsDir: string

  /**
   * Output directory for Liquid page templates
   * @example './views/pages/docs'
   */
  outputDir: string

  /**
   * Output directory for demo partials
   * @example './views/partials/demos'
   */
  demosDir?: string

  /**
   * Output path for navigation JSON (for sidebar)
   * @example './dist/docs-nav.json'
   */
  navOutput?: string

  /**
   * Base URL path for documentation
   * @example '/docs' → /docs/components/button
   */
  basePath?: string

  /**
   * Components available in MDX without explicit import
   * Key: component name in MDX
   * Value: import path (can use @ alias)
   * 
   * @example
   * {
   *   Button: '@/components/ui/Button',
   *   Card: '@/components/Card',
   * }
   */
  components?: Record<string, string>

  /**
   * Directory containing TypeScript component sources
   * Used for automatic props extraction
   * @example './src/components'
   */
  propsSource?: string

  /**
   * MDX compiler options
   */
  mdxOptions?: MdxCompilerOptions

  /**
   * Table of Contents configuration
   */
  toc?: TocConfig
}

// ============================================================================
// Standalone MDX Config (for mdx.config.ts - dev mode)
// ============================================================================

/**
 * Standalone MDX configuration for development
 * Used in mdx.config.ts for Vite dev server
 */
export interface MdxConfig {
  /**
   * Directory containing MDX documentation files
   */
  docsDir: string

  /**
   * Output directory for generated pages (build mode)
   */
  outputDir?: string

  /**
   * Base URL path for documentation
   */
  basePath?: string

  /**
   * Site metadata
   */
  site?: SiteConfig

  /**
   * Default frontmatter applied to all pages
   */
  frontmatter?: Record<string, unknown>

  /**
   * Components available in MDX without explicit import
   */
  components?: Record<string, string>

  /**
   * MDX compiler options
   */
  mdx?: MdxCompilerOptions

  /**
   * Table of Contents configuration
   */
  toc?: TocConfig

  /**
   * Sidebar configuration
   */
  sidebar?: 'auto' | SidebarItem[]

  /**
   * Sidebar sort order when using 'auto'
   */
  sidebarSort?: 'alphabetical' | 'frontmatter'
}

// ============================================================================
// Shared Config Types
// ============================================================================

export interface SiteConfig {
  title?: string
  description?: string
  lang?: string
  logo?: string
  favicon?: string
}

export interface MdxCompilerOptions {
  remarkPlugins?: unknown[]
  rehypePlugins?: unknown[]
  gfm?: boolean
}

export interface TocConfig {
  minLevel?: number
  maxLevel?: number
}

export interface SidebarItem {
  text: string
  link?: string
  items?: SidebarItem[]
  collapsed?: boolean
}

// ============================================================================
// Page Content Types
// ============================================================================

/**
 * Frontmatter extracted from MDX file
 */
export interface Frontmatter {
  title?: string
  description?: string
  layout?: string
  order?: number
  [key: string]: unknown
}

/**
 * Table of Contents entry
 */
export interface TocEntry {
  /**
   * Heading level (1-6)
   */
  depth: number

  /**
   * Heading text content
   */
  text: string

  /**
   * URL-safe slug for anchor links
   */
  slug: string

  /**
   * Nested headings (for hierarchical TOC)
   */
  children?: TocEntry[]
}

/**
 * Parsed MDX page data
 */
export interface PageData {
  /**
   * React component rendered from MDX content
   */
  Content: ComponentType<Record<string, unknown>>

  /**
   * Extracted frontmatter
   */
  frontmatter: Frontmatter

  /**
   * Table of contents entries
   */
  toc: TocEntry[]

  /**
   * First paragraph as excerpt (for listings)
   */
  excerpt?: string

  /**
   * File path relative to docsDir
   */
  filePath: string

  /**
   * URL path for routing
   */
  urlPath: string

  /**
   * Raw MDX source (for debugging/tooling)
   */
  raw?: string
}

/**
 * Page content provided by usePageContent hook
 */
export interface PageContent {
  Content: ComponentType<Record<string, unknown>>
  frontmatter: Frontmatter
  toc: TocEntry[]
  excerpt?: string
}

// ============================================================================
// Docs Tree Types (for sidebar/nav generation)
// ============================================================================

/**
 * Entry in the docs tree (file or directory)
 */
export interface DocsTreeEntry {
  /**
   * Display name (from frontmatter.title or filename)
   */
  name: string

  /**
   * URL path for routing
   */
  path: string

  /**
   * File path relative to docsDir
   */
  filePath: string

  /**
   * Frontmatter from MDX file
   */
  frontmatter: Frontmatter

  /**
   * Child entries (for directories)
   */
  children?: DocsTreeEntry[]

  /**
   * Is this a directory index (index.mdx)?
   */
  isIndex?: boolean
}

/**
 * Navigation structure for Liquid sidebar
 */
export interface NavItem {
  title: string
  path: string
  order?: number
  children?: NavItem[]
}

export interface DocsNavigation {
  items: NavItem[]
  generated: string // ISO timestamp
}

// ============================================================================
// Component Props Types
// ============================================================================

/**
 * Extracted prop definition for PropsTable
 */
export interface PropDefinition {
  name: string
  type: string
  required: boolean
  defaultValue?: string
  description?: string
}

/**
 * Component props metadata
 */
export interface ComponentPropsData {
  componentName: string
  props: PropDefinition[]
  sourceFile: string
}

// ============================================================================
// Generator Output Types
// ============================================================================

/**
 * Result of generating a single MDX page
 */
export interface GeneratedMdxPage {
  /**
   * URL path
   */
  urlPath: string

  /**
   * Generated Liquid template content
   */
  liquidContent: string

  /**
   * Generated HTML content (for html mode)
   */
  htmlContent: string

  /**
   * Frontmatter from source
   */
  frontmatter: Frontmatter

  /**
   * Table of contents
   */
  toc: TocEntry[]

  /**
   * Demo partials extracted from ComponentPreview
   */
  demos: GeneratedDemo[]
}

/**
 * Generated demo partial
 */
export interface GeneratedDemo {
  /**
   * Demo identifier (e.g., 'button-primary')
   */
  id: string

  /**
   * Liquid partial content
   */
  liquidContent: string

  /**
   * Original JSX code for display
   */
  code: string
}

// ============================================================================
// Vite Plugin Types
// ============================================================================

/**
 * Options for Vite MDX plugin
 */
export interface VitePluginOptions {
  /**
   * Path to mdx.config.ts (auto-detected if not provided)
   */
  configPath?: string

  /**
   * Docs directory (relative to project root)
   */
  docsDir?: string

  /**
   * Components to inject into MDX scope
   */
  components?: Record<string, string>
}
