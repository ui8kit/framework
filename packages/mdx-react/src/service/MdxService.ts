/**
 * MdxService - Service adapter for MDX documentation generation.
 * 
 * Implements IService interface from @ui8kit/generator for integration
 * with the Orchestrator pipeline. Can also be used standalone.
 * 
 * @example Standalone usage:
 * ```typescript
 * const service = new MdxService();
 * await service.initialize(context);
 * const result = await service.execute({
 *   docsDir: './docs',
 *   outputDir: './dist/html',
 *   basePath: '/docs',
 * });
 * ```
 * 
 * @example Via Orchestrator:
 * ```typescript
 * orchestrator.registerService(new MdxService());
 * orchestrator.addStage(new MdxStage());
 * ```
 */

import type { 
  MdxGeneratorConfig,
  GeneratedMdxPage,
  NavItem,
  DocsNavigation,
  Frontmatter,
  TocConfig,
} from '../core/types'
import type { ComponentType } from 'react'

// =============================================================================
// Service Interface Types (copied to avoid circular dependency)
// =============================================================================

/**
 * Logger interface (subset of ILogger from generator)
 */
export interface MdxLogger {
  debug(message: string, ...args: unknown[]): void
  info(message: string, ...args: unknown[]): void
  warn(message: string, ...args: unknown[]): void
  error(message: string, ...args: unknown[]): void
}

/**
 * Event bus interface (subset of IEventBus from generator)
 */
export interface MdxEventBus {
  emit(event: string, data?: unknown): void
  on(event: string, handler: (data: unknown) => void): () => void
}

/**
 * Service context for MdxService initialization
 */
export interface MdxServiceContext {
  config?: {
    html?: {
      mode?: 'tailwind' | 'semantic' | 'inline'
    }
    [key: string]: unknown
  }
  logger: MdxLogger
  eventBus?: MdxEventBus
}

// =============================================================================
// Service Input/Output Types
// =============================================================================

/**
 * Input for MdxService.execute()
 */
export interface MdxServiceInput {
  /**
   * Directory containing MDX files
   */
  docsDir: string
  
  /**
   * Output directory for generated HTML
   */
  outputDir: string
  
  /**
   * Base URL path for documentation routes
   * @default ''
   */
  basePath?: string
  
  /**
   * Path for navigation JSON output
   */
  navOutput?: string
  
  /**
   * Import path aliases for resolving imports in MDX files.
   * Same format as Vite's resolve.alias.
   * @example
   * ```typescript
   * aliases: {
   *   '@ui8kit/core': '../../packages/ui8kit/src/index',
   *   '@': './src',
   * }
   * ```
   */
  aliases?: Record<string, string>
  
  /**
   * @deprecated Use `aliases` instead. Components are now auto-resolved from MDX imports.
   */
  components?: Record<string, string>
  
  /**
   * Source directory for TypeScript props extraction
   */
  propsSource?: string
  
  /**
   * Table of Contents configuration
   */
  toc?: {
    minLevel?: number
    maxLevel?: number
  }
  
  /**
   * HTML output mode
   * @default 'tailwind'
   */
  htmlMode?: 'tailwind' | 'semantic' | 'inline'
  
  /**
   * Enable verbose logging
   * @default false
   */
  verbose?: boolean
  
  /**
   * @deprecated Use `aliases` with '@' key instead.
   */
  rootDir?: string
}

/**
 * Output from MdxService.execute()
 */
export interface MdxServiceOutput {
  /**
   * Number of pages generated
   */
  pages: number
  
  /**
   * Generated navigation structure
   */
  navigation: NavItem[]
  
  /**
   * Generated page details
   */
  generatedPages: Array<{
    urlPath: string
    outputPath: string
    title: string
  }>
  
  /**
   * Total generation time in ms
   */
  duration: number
}

// =============================================================================
// File System Interface (for testability)
// =============================================================================

/**
 * File system interface for MdxService
 */
export interface MdxFileSystem {
  readFile(path: string): Promise<string>
  writeFile(path: string, content: string): Promise<void>
  mkdir(path: string): Promise<void>
  readdir(path: string): Promise<string[]>
  stat(path: string): Promise<{ isDirectory(): boolean }>
  exists(path: string): Promise<boolean>
}

// =============================================================================
// MDX Compiler Interface (for DI and testing)
// =============================================================================

/**
 * Options for compiling a single MDX file
 */
export interface MdxCompileOptions {
  filePath: string
  docsDir: string
  basePath: string
  /**
   * Import path aliases for resolving imports in MDX files.
   */
  aliases?: Record<string, string>
  /**
   * @deprecated Use `aliases` instead
   */
  components?: Record<string, ComponentType>
  tocConfig?: TocConfig
  htmlMode: 'tailwind' | 'semantic' | 'inline'
}

/**
 * MDX Compiler interface for dependency injection
 */
export interface IMdxCompiler {
  compileMdxFile(options: MdxCompileOptions): Promise<GeneratedMdxPage>
}

// =============================================================================
// Service Options
// =============================================================================

/**
 * Options for MdxService constructor
 */
export interface MdxServiceOptions {
  /**
   * Custom file system (for testing)
   */
  fileSystem?: MdxFileSystem
  
  /**
   * Custom MDX compiler (for testing)
   */
  compiler?: IMdxCompiler
}

// =============================================================================
// MdxService Implementation
// =============================================================================

/**
 * MdxService - Generates documentation pages from MDX files.
 * 
 * Responsibilities:
 * - Scan docs directory for MDX files
 * - Parse frontmatter and extract TOC
 * - Generate static HTML pages
 * - Generate navigation JSON
 * - Support configurable output modes
 */
export class MdxService {
  readonly name = 'MdxService'
  readonly version = '1.0.0'
  readonly dependencies: readonly string[] = ['HtmlConverterService']
  
  private context?: MdxServiceContext
  private fs: MdxFileSystem
  private compiler: IMdxCompiler
  private initialized = false
  
  constructor(options: MdxServiceOptions = {}) {
    this.fs = options.fileSystem ?? this.createDefaultFileSystem()
    this.compiler = options.compiler ?? this.createDefaultCompiler()
  }
  
  /**
   * Initialize the service with context
   */
  async initialize(context: MdxServiceContext): Promise<void> {
    this.context = context
    this.initialized = true
    this.log('debug', 'MdxService initialized')
  }
  
  /**
   * Execute MDX documentation generation
   */
  async execute(input: MdxServiceInput): Promise<MdxServiceOutput> {
    if (!this.initialized) {
      throw new Error('MdxService not initialized. Call initialize() first.')
    }
    
    const startTime = performance.now()
    const {
      docsDir,
      outputDir,
      basePath = '',
      navOutput,
      verbose = false,
    } = input
    
    const htmlMode = input.htmlMode ?? this.context?.config?.html?.mode ?? 'tailwind'
    
    this.log('info', `Generating MDX documentation from ${docsDir}`)
    
    // 1. Scan for MDX files
    const mdxFiles = await this.scanMdxFiles(docsDir)
    this.log('info', `Found ${mdxFiles.length} MDX files`)
    
    if (mdxFiles.length === 0) {
      return {
        pages: 0,
        navigation: [],
        generatedPages: [],
        duration: performance.now() - startTime,
      }
    }
    
    // 2. Build aliases from input
    // Merge explicit aliases with legacy @ alias from rootDir
    const aliases: Record<string, string> = { ...input.aliases }
    
    // Backwards compatibility: convert rootDir to @ alias
    if (input.rootDir && !aliases['@']) {
      aliases['@'] = input.rootDir
    }
    
    // 3. Generate pages
    const generatedPages: MdxServiceOutput['generatedPages'] = []
    
    for (const filePath of mdxFiles) {
      const relativePath = this.getRelativePath(filePath, docsDir)
      const urlPath = this.mdxFileToUrl(relativePath, basePath)
      const outputPath = this.urlToOutputPath(urlPath, outputDir)
      
      if (verbose) {
        this.log('debug', `Processing: ${relativePath} → ${urlPath}`)
      }
      
      try {
        // Compile MDX to HTML using the compiler
        // Compiler now auto-resolves imports via aliases
        const compiled = await this.compiler.compileMdxFile({
          filePath,
          docsDir,
          basePath,
          aliases,
          tocConfig: input.toc,
          htmlMode,
        })
        
        // Wrap HTML content in full page template
        const fullHtml = this.wrapHtmlPage(compiled, htmlMode)
        
        // Write output
        await this.ensureDir(outputPath)
        await this.fs.writeFile(outputPath, fullHtml)
        
        generatedPages.push({
          urlPath: compiled.urlPath,
          outputPath,
          title: compiled.frontmatter.title || this.pathToTitle(urlPath),
        })
        
        // Emit event
        this.emit('mdx:page:generated', {
          urlPath: compiled.urlPath,
          outputPath,
          title: compiled.frontmatter.title,
        })
      } catch (error) {
        this.log('error', `Failed to compile ${relativePath}: ${error}`)
        
        // Fallback to placeholder on error
        const content = await this.fs.readFile(filePath)
        const frontmatter = this.parseFrontmatter(content)
        const html = this.generateFallbackPage(frontmatter, urlPath, htmlMode, error as Error)
        
        await this.ensureDir(outputPath)
        await this.fs.writeFile(outputPath, html)
        
        generatedPages.push({
          urlPath,
          outputPath,
          title: frontmatter.title || this.pathToTitle(urlPath),
        })
      }
    }
    
    // 3. Generate navigation
    const navigation = await this.generateNavigation(mdxFiles, docsDir, basePath)
    
    if (navOutput) {
      const navData: DocsNavigation = {
        items: navigation,
        generated: new Date().toISOString(),
      }
      await this.ensureDir(navOutput)
      await this.fs.writeFile(navOutput, JSON.stringify(navData, null, 2))
      this.log('info', `Generated navigation: ${navOutput}`)
    }
    
    const duration = performance.now() - startTime
    
    this.log('info', `Generated ${generatedPages.length} pages in ${Math.round(duration)}ms`)
    
    // Emit completion event
    this.emit('mdx:complete', {
      pages: generatedPages.length,
      duration,
    })
    
    return {
      pages: generatedPages.length,
      navigation,
      generatedPages,
      duration,
    }
  }
  
  /**
   * Dispose and cleanup resources
   */
  async dispose(): Promise<void> {
    this.context = undefined
    this.initialized = false
  }
  
  // ===========================================================================
  // Private Methods
  // ===========================================================================
  
  /**
   * Scan directory for MDX files recursively
   */
  private async scanMdxFiles(dir: string): Promise<string[]> {
    const files: string[] = []
    
    const scan = async (currentDir: string): Promise<void> => {
      let entries: string[]
      try {
        entries = await this.fs.readdir(currentDir)
      } catch {
        return // Directory doesn't exist
      }
      
      for (const entry of entries) {
        const fullPath = this.joinPath(currentDir, entry)
        
        try {
          const stats = await this.fs.stat(fullPath)
          
          if (stats.isDirectory()) {
            await scan(fullPath)
          } else if (entry.endsWith('.mdx') || entry.endsWith('.md')) {
            files.push(fullPath)
          }
        } catch {
          // Skip files we can't stat
        }
      }
    }
    
    await scan(dir)
    return files
  }
  
  /**
   * Convert MDX file path to URL path
   */
  private mdxFileToUrl(relativePath: string, basePath: string): string {
    let url = relativePath
      .replace(/\.(mdx?|md)$/, '')
      .replace(/\\/g, '/')
    
    // Handle index files
    if (url.endsWith('/index') || url === 'index') {
      url = url.replace(/\/?index$/, '')
    }
    
    const base = basePath.replace(/\/$/, '')
    return url ? `${base}/${url}` : base || '/'
  }
  
  /**
   * Convert URL path to output file path
   */
  private urlToOutputPath(urlPath: string, outputDir: string): string {
    if (urlPath === '/' || urlPath === '') {
      return this.joinPath(outputDir, 'index.html')
    }
    return this.joinPath(outputDir, urlPath, 'index.html')
  }
  
  /**
   * Parse frontmatter from MDX content
   */
  private parseFrontmatter(content: string): Frontmatter {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
    if (!match) return {}
    
    const result: Frontmatter = {}
    const lines = match[1].split(/\r?\n/)
    
    for (const line of lines) {
      const kvMatch = line.match(/^(\w+):\s*(.+)$/)
      if (kvMatch) {
        const key = kvMatch[1]
        let value: string | number = kvMatch[2].replace(/^['"]|['"]$/g, '')
        
        // Parse numbers
        if (key === 'order' && /^\d+$/.test(value)) {
          value = parseInt(value, 10)
        }
        
        result[key] = value
      }
    }
    
    return result
  }
  
  /**
   * Generate navigation from MDX files
   */
  private async generateNavigation(
    mdxFiles: string[],
    docsDir: string,
    basePath: string
  ): Promise<NavItem[]> {
    const nav: NavItem[] = []
    
    for (const file of mdxFiles) {
      const content = await this.fs.readFile(file)
      const frontmatter = this.parseFrontmatter(content)
      const relativePath = this.getRelativePath(file, docsDir)
      const urlPath = this.mdxFileToUrl(relativePath, basePath)
      
      nav.push({
        title: frontmatter.title || this.pathToTitle(urlPath),
        path: urlPath || '/',
        order: typeof frontmatter.order === 'number' ? frontmatter.order : 999,
      })
    }
    
    // Sort by order then by title
    return nav.sort((a, b) => {
      const orderA = a.order ?? 999
      const orderB = b.order ?? 999
      if (orderA !== orderB) return orderA - orderB
      return a.title.localeCompare(b.title)
    })
  }
  
  /**
   * Convert URL path to readable title
   */
  private pathToTitle(urlPath: string): string {
    if (!urlPath || urlPath === '/') return 'Home'
    const segment = urlPath.split('/').pop() || ''
    return segment
      .replace(/-/g, ' ')
      .replace(/\b\w/g, c => c.toUpperCase())
  }
  
  /**
   * Get relative path from base directory
   */
  private getRelativePath(filePath: string, baseDir: string): string {
    // Normalize paths
    const normalizedFile = filePath.replace(/\\/g, '/')
    const normalizedBase = baseDir.replace(/\\/g, '/').replace(/\/$/, '')
    
    if (normalizedFile.startsWith(normalizedBase)) {
      return normalizedFile.slice(normalizedBase.length + 1)
    }
    return normalizedFile
  }
  
  /**
   * Join path segments
   */
  private joinPath(...segments: string[]): string {
    return segments
      .map((s, i) => i === 0 ? s : s.replace(/^[/\\]+/, ''))
      .join('/')
      .replace(/\\/g, '/')
  }
  
  /**
   * Ensure directory exists for a file path
   */
  private async ensureDir(filePath: string): Promise<void> {
    const dir = filePath.replace(/[/\\][^/\\]+$/, '')
    await this.fs.mkdir(dir)
  }
  
  /**
   * Escape HTML special characters
   */
  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
  }
  
  /**
   * Log message using context logger
   */
  private log(level: 'debug' | 'info' | 'warn' | 'error', message: string): void {
    if (this.context?.logger) {
      this.context.logger[level](message)
    }
  }
  
  /**
   * Emit event using context event bus
   */
  private emit(event: string, data: unknown): void {
    if (this.context?.eventBus) {
      this.context.eventBus.emit(event, data)
    }
  }
  
  
  /**
   * Wrap compiled HTML content in a full page template
   */
  private wrapHtmlPage(
    compiled: GeneratedMdxPage,
    mode: 'tailwind' | 'semantic' | 'inline'
  ): string {
    const title = compiled.frontmatter.title || this.pathToTitle(compiled.urlPath)
    const description = compiled.frontmatter.description || ''
    
    // Use class or data-class based on mode
    const classAttr = mode === 'semantic' ? 'class' : 'data-class'
    
    // Generate TOC sidebar if available
    const tocHtml = compiled.toc.length > 0 
      ? this.generateTocHtml(compiled.toc, classAttr)
      : ''
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(title)}</title>
  <meta name="description" content="${this.escapeHtml(description)}">
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
  <div id="app">
    <div ${classAttr}="docs-page">
      <article ${classAttr}="docs-content">
        ${compiled.htmlContent}
      </article>
      ${tocHtml}
    </div>
  </div>
  <script type="module" src="/assets/js/main.js"></script>
</body>
</html>`
  }
  
  /**
   * Generate Table of Contents HTML
   */
  private generateTocHtml(
    toc: GeneratedMdxPage['toc'],
    classAttr: string
  ): string {
    const items = toc.map(entry => 
      `<li><a href="#${entry.slug}">${this.escapeHtml(entry.text)}</a></li>`
    ).join('\n        ')
    
    return `
      <aside ${classAttr}="docs-toc">
        <nav ${classAttr}="toc-nav">
          <h3>On this page</h3>
          <ul>
        ${items}
          </ul>
        </nav>
      </aside>`
  }
  
  /**
   * Generate fallback page when compilation fails
   */
  private generateFallbackPage(
    frontmatter: Frontmatter,
    urlPath: string,
    mode: 'tailwind' | 'semantic' | 'inline',
    error: Error
  ): string {
    const title = frontmatter.title || this.pathToTitle(urlPath)
    const description = frontmatter.description || ''
    const classAttr = mode === 'semantic' ? 'class' : 'data-class'
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.escapeHtml(title)}</title>
  <meta name="description" content="${this.escapeHtml(description)}">
  <link rel="stylesheet" href="/assets/css/styles.css">
</head>
<body>
  <div id="app">
    <div ${classAttr}="docs-page">
      <article ${classAttr}="docs-content">
        <h1>${this.escapeHtml(title)}</h1>
        ${description ? `<p>${this.escapeHtml(description)}</p>` : ''}
        <div ${classAttr}="error-notice">
          <p><strong>Error:</strong> Failed to compile MDX content.</p>
          <pre>${this.escapeHtml(error.message)}</pre>
        </div>
      </article>
    </div>
  </div>
  <script type="module" src="/assets/js/main.js"></script>
</body>
</html>`
  }
  
  /**
   * Create default MDX compiler
   */
  private createDefaultCompiler(): IMdxCompiler {
    return {
      compileMdxFile: async (options) => {
        // Dynamically import the compiler to avoid bundling it in browser
        const { compileMdxFile } = await import('../generator/mdx-compiler')
        return compileMdxFile(options)
      }
    }
  }
  
  /**
   * Create default file system implementation
   */
  private createDefaultFileSystem(): MdxFileSystem {
    return {
      readFile: async (path: string) => {
        const { readFile } = await import('node:fs/promises')
        return readFile(path, 'utf-8')
      },
      writeFile: async (path: string, content: string) => {
        const { writeFile } = await import('node:fs/promises')
        await writeFile(path, content, 'utf-8')
      },
      mkdir: async (path: string) => {
        const { mkdir } = await import('node:fs/promises')
        await mkdir(path, { recursive: true })
      },
      readdir: async (path: string) => {
        const { readdir } = await import('node:fs/promises')
        return readdir(path)
      },
      stat: async (path: string) => {
        const { stat } = await import('node:fs/promises')
        return stat(path)
      },
      exists: async (path: string) => {
        const { access } = await import('node:fs/promises')
        try {
          await access(path)
          return true
        } catch {
          return false
        }
      },
    }
  }
}
