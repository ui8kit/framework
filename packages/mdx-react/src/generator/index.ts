import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, dirname, relative } from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import type { 
  MdxConfig, 
  GeneratedPage, 
  Frontmatter, 
  TocEntry,
  DocsTreeEntry 
} from '../types'
import { parseMdxFile } from '../utils/parser'
import { scanDocsTree, flattenDocsTree } from '../utils/scanner'
import { loadConfig } from '../config'

export interface MdxGeneratorOptions {
  /**
   * Path to mdx.config.ts
   */
  configPath: string
  
  /**
   * Base directory for resolving paths (defaults to config file directory)
   */
  cwd?: string
  
  /**
   * Verbose logging
   */
  verbose?: boolean
}

/**
 * MDX Generator - converts MDX files to static HTML
 * 
 * This is an isolated pipeline that:
 * 1. Scans docs directory for MDX files
 * 2. Parses frontmatter and TOC
 * 3. Compiles MDX to React components
 * 4. Renders to static HTML
 * 
 * @example
 * ```ts
 * import { MdxGenerator } from '@ui8kit/mdx-react/generator'
 * 
 * const generator = new MdxGenerator({
 *   configPath: './mdx.config.ts'
 * })
 * 
 * await generator.generate()
 * ```
 */
export class MdxGenerator {
  private config!: MdxConfig
  private configDir: string
  private verbose: boolean
  
  constructor(private options: MdxGeneratorOptions) {
    this.configDir = options.cwd || dirname(options.configPath)
    this.verbose = options.verbose ?? false
  }
  
  /**
   * Generate all MDX pages to static HTML
   */
  async generate(): Promise<GeneratedPage[]> {
    // Load config
    this.config = await loadConfig(this.options.configPath)
    
    this.log('🚀 MDX Generator starting...')
    this.log(`📁 Docs directory: ${this.config.docsDir}`)
    this.log(`📁 Output directory: ${this.config.outputDir}`)
    
    // Scan docs tree
    const docsDir = join(this.configDir, this.config.docsDir)
    const tree = await scanDocsTree(docsDir, {
      basePath: this.config.basePath,
      sort: this.config.sidebarSort,
    })
    
    // Flatten to get all pages
    const pages = flattenDocsTree(tree)
    this.log(`📄 Found ${pages.length} pages to generate`)
    
    // Generate each page
    const results: GeneratedPage[] = []
    
    for (const page of pages) {
      try {
        const result = await this.generatePage(page, docsDir)
        results.push(result)
        this.log(`  ✓ ${page.path}`)
      } catch (error) {
        console.error(`  ✗ ${page.path}:`, error)
      }
    }
    
    // Write docs tree JSON (for sidebar generation in apps)
    await this.writeDocsTree(tree)
    
    this.log(`✅ Generated ${results.length} pages`)
    
    return results
  }
  
  /**
   * Generate single page from MDX file
   */
  private async generatePage(
    entry: DocsTreeEntry,
    docsDir: string
  ): Promise<GeneratedPage> {
    const filePath = join(docsDir, entry.filePath)
    const source = await readFile(filePath, 'utf-8')
    
    // Parse frontmatter and TOC
    const { frontmatter, content, toc, excerpt } = parseMdxFile(source, this.config.toc)
    
    // Compile MDX to JavaScript
    const compiled = await compile(content, {
      outputFormat: 'function-body',
      development: false,
      // @ts-ignore - MDX types mismatch
      remarkPlugins: this.config.mdx?.remarkPlugins || [],
      // @ts-ignore
      rehypePlugins: this.config.mdx?.rehypePlugins || [],
    })
    
    // Run compiled MDX to get React component
    const { default: Content } = await run(compiled, {
      ...runtime,
      baseUrl: import.meta.url,
    })
    
    // Render to HTML
    const element = React.createElement(Content, {})
    const html = renderToStaticMarkup(element)
    
    // Write HTML file
    await this.writeHtmlFile(entry.path, html, frontmatter, toc)
    
    return {
      urlPath: entry.path,
      html,
      frontmatter,
      toc,
    }
  }
  
  /**
   * Write generated HTML to output directory
   */
  private async writeHtmlFile(
    urlPath: string,
    content: string,
    frontmatter: Frontmatter,
    toc: TocEntry[]
  ): Promise<void> {
    const outputDir = join(this.configDir, this.config.outputDir || './dist/docs')
    
    // Convert URL path to file path
    // /docs/components/button → docs/components/button/index.html
    const relativePath = urlPath.startsWith('/') ? urlPath.slice(1) : urlPath
    const htmlPath = join(outputDir, relativePath, 'index.html')
    
    // Ensure directory exists
    await mkdir(dirname(htmlPath), { recursive: true })
    
    // Wrap content with page metadata as JSON for client hydration
    const pageData = {
      frontmatter,
      toc,
    }
    
    const html = `<!DOCTYPE html>
<html lang="${this.config.site?.lang || 'en'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${frontmatter.title || 'Documentation'} - ${this.config.site?.title || 'Docs'}</title>
  ${frontmatter.description ? `<meta name="description" content="${frontmatter.description}">` : ''}
  <script type="application/json" id="page-data">${JSON.stringify(pageData)}</script>
</head>
<body>
  <div id="content" data-page-path="${urlPath}">
${content}
  </div>
</body>
</html>`
    
    await writeFile(htmlPath, html, 'utf-8')
  }
  
  /**
   * Write docs tree JSON for sidebar generation
   */
  private async writeDocsTree(tree: DocsTreeEntry[]): Promise<void> {
    const outputDir = join(this.configDir, this.config.outputDir || './dist/docs')
    const jsonPath = join(outputDir, '_docs-tree.json')
    
    await mkdir(dirname(jsonPath), { recursive: true })
    await writeFile(jsonPath, JSON.stringify(tree, null, 2), 'utf-8')
    
    this.log(`  → ${jsonPath}`)
  }
  
  private log(message: string): void {
    if (this.verbose) {
      console.log(message)
    }
  }
}

/**
 * Convenience function to generate MDX pages
 */
export async function generateMdxPages(options: MdxGeneratorOptions): Promise<GeneratedPage[]> {
  const generator = new MdxGenerator(options)
  return generator.generate()
}
