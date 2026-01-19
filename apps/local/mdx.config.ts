import { defineConfig } from '@ui8kit/mdx-react'

/**
 * MDX Configuration for UI8Kit documentation
 * 
 * This config is passed to @ui8kit/mdx-react for:
 * - Dev server: Vite plugin for HMR and live preview
 * - Build: Static HTML generation from MDX files
 */
export default defineConfig({
  /**
   * Directory containing MDX documentation files
   * Relative to this config file
   */
  docsDir: './docs',

  /**
   * Output directory for generated HTML pages
   * Used by the generator, not during dev
   */
  outputDir: './dist/docs',

  /**
   * Base URL for documentation pages
   * @example '/docs' → /docs/components/button
   */
  basePath: '/docs',

  /**
   * Site metadata
   */
  site: {
    title: 'UI8Kit Documentation',
    description: 'Component documentation for UI8Kit framework',
    lang: 'en',
  },

  /**
   * Frontmatter defaults applied to all pages
   */
  frontmatter: {
    layout: 'docs',
  },

  /**
   * Components available in MDX files without explicit import
   * These are auto-injected into MDX scope
   */
  components: {
    // UI8Kit components
    Button: '@/components/ui/Button',
    Card: '@/components/Card',
    Badge: '@/components/ui/Badge',
    Stack: '@/components/ui/Stack',
    Box: '@/components/ui/Box',
    Grid: '@/components/Grid',
    Text: '@/components/ui/Text',
    Title: '@/components/ui/Title',
    Icon: '@/components/ui/Icon',
    Image: '@/components/ui/Image',
    Container: '@/components/ui/Container',
    Group: '@/components/ui/Group',
    
    // Documentation-specific components
    ComponentExample: '@ui8kit/mdx-react/components/ComponentExample',
    CodeBlock: '@ui8kit/mdx-react/components/CodeBlock',
    PropsTable: '@ui8kit/mdx-react/components/PropsTable',
    Callout: '@ui8kit/mdx-react/components/Callout',
  },

  /**
   * MDX compiler options
   */
  mdx: {
    /**
     * Remark plugins for markdown processing
     */
    remarkPlugins: [],
    
    /**
     * Rehype plugins for HTML processing
     */
    rehypePlugins: [],
    
    /**
     * Enable GitHub Flavored Markdown
     */
    gfm: true,
  },

  /**
   * Table of Contents configuration
   */
  toc: {
    /**
     * Minimum heading level to include
     */
    minLevel: 2,
    
    /**
     * Maximum heading level to include
     */
    maxLevel: 3,
  },

  /**
   * Sidebar configuration
   * 'auto' - Generate from file structure
   * Array - Manual configuration
   */
  sidebar: 'auto',

  /**
   * Sidebar sort order
   * 'alphabetical' - Sort by filename
   * 'frontmatter' - Sort by frontmatter.order field
   */
  sidebarSort: 'frontmatter',
})
