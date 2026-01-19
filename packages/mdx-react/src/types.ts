import type { ReactNode, ComponentType } from 'react'

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * MDX configuration for @ui8kit/mdx-react
 */
export interface MdxConfig {
  /**
   * Directory containing MDX documentation files
   * Relative to config file location
   */
  docsDir: string

  /**
   * Output directory for generated HTML pages
   */
  outputDir?: string

  /**
   * Base URL path for documentation
   * @example '/docs' → /docs/components/button
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
   * Key: component name in MDX
   * Value: import path (can use @ alias)
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
   * 'auto' - Generate from file structure
   * Array - Manual sidebar items
   */
  sidebar?: 'auto' | SidebarItem[]

  /**
   * Sidebar sort order when using 'auto'
   */
  sidebarSort?: 'alphabetical' | 'frontmatter'
}

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
// Docs Tree Types (for sidebar generation)
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

// ============================================================================
// Generator Types
// ============================================================================

/**
 * Options for MDX generator
 */
export interface GeneratorOptions {
  /**
   * Resolved MDX config
   */
  config: MdxConfig

  /**
   * Absolute path to config file directory
   */
  configDir: string

  /**
   * Components map (resolved paths)
   */
  components?: Record<string, ComponentType>

  /**
   * Custom layout component
   */
  layout?: ComponentType<{ children: ReactNode; frontmatter: Frontmatter; toc: TocEntry[] }>
}

/**
 * Result of generating a single page
 */
export interface GeneratedPage {
  /**
   * URL path
   */
  urlPath: string

  /**
   * Generated HTML content
   */
  html: string

  /**
   * Frontmatter from source
   */
  frontmatter: Frontmatter

  /**
   * Table of contents
   */
  toc: TocEntry[]
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
}
