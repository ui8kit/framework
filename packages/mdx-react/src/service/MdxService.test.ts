import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MdxService, type MdxServiceContext, type MdxFileSystem, type IMdxCompiler, type MdxCompileOptions } from './MdxService'
import type { GeneratedMdxPage } from '../core/types'

// =============================================================================
// Test Utilities
// =============================================================================

/**
 * Create a mock logger for testing
 */
function createMockLogger() {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }
}

/**
 * Create a mock event bus for testing
 */
function createMockEventBus() {
  return {
    emit: vi.fn(),
    on: vi.fn().mockReturnValue(() => {}),
  }
}

/**
 * Create a mock file system for testing
 */
function createMockFileSystem() {
  const files = new Map<string, string>()
  const dirs = new Set<string>()
  
  return {
    files,
    dirs,
    readFile: vi.fn(async (path: string) => {
      const normalized = path.replace(/\\/g, '/')
      const content = files.get(normalized)
      if (content === undefined) {
        throw new Error(`ENOENT: no such file or directory, open '${path}'`)
      }
      return content
    }),
    writeFile: vi.fn(async (path: string, content: string) => {
      const normalized = path.replace(/\\/g, '/')
      files.set(normalized, content)
    }),
    mkdir: vi.fn(async (path: string) => {
      const normalized = path.replace(/\\/g, '/')
      dirs.add(normalized)
    }),
    readdir: vi.fn(async (path: string) => {
      const normalized = path.replace(/\\/g, '/').replace(/\/$/, '')
      const entries: string[] = []
      
      for (const key of files.keys()) {
        if (key.startsWith(normalized + '/')) {
          const rest = key.slice(normalized.length + 1)
          const firstPart = rest.split('/')[0]
          if (firstPart && !entries.includes(firstPart)) {
            entries.push(firstPart)
          }
        }
      }
      
      return entries
    }),
    stat: vi.fn(async (path: string) => {
      const normalized = path.replace(/\\/g, '/')
      
      // Check if it's a directory (has files under it)
      for (const key of files.keys()) {
        if (key.startsWith(normalized + '/')) {
          return { isDirectory: () => true }
        }
      }
      
      // Check if it's a file
      if (files.has(normalized)) {
        return { isDirectory: () => false }
      }
      
      throw new Error(`ENOENT: no such file or directory, stat '${path}'`)
    }),
    exists: vi.fn(async (path: string) => {
      const normalized = path.replace(/\\/g, '/')
      return files.has(normalized)
    }),
    reset: () => {
      files.clear()
      dirs.clear()
    },
  }
}

/**
 * Create mock service context
 */
function createMockContext(overrides: Partial<MdxServiceContext> = {}): MdxServiceContext {
  return {
    config: {
      html: { mode: 'tailwind' as const },
    },
    logger: createMockLogger(),
    eventBus: createMockEventBus(),
    ...overrides,
  }
}

/**
 * Create a mock MDX compiler for testing
 * @param mockFs - Optional mock file system to read actual file content
 */
function createMockCompiler(mockFs?: ReturnType<typeof createMockFileSystem>): IMdxCompiler & { compileMdxFile: ReturnType<typeof vi.fn> } {
  return {
    compileMdxFile: vi.fn(async (options: MdxCompileOptions): Promise<GeneratedMdxPage> => {
      const fileName = options.filePath.split('/').pop() || 'unknown'
      const baseName = fileName.replace(/\.(mdx?|md)$/, '')
      
      // Try to read frontmatter from mock filesystem if available
      let frontmatter: Record<string, unknown> = {}
      if (mockFs) {
        const normalized = options.filePath.replace(/\\/g, '/')
        const content = mockFs.files.get(normalized)
        if (content) {
          // Parse frontmatter
          const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/)
          if (match) {
            const lines = match[1].split(/\r?\n/)
            for (const line of lines) {
              const kvMatch = line.match(/^(\w+):\s*(.+)$/)
              if (kvMatch) {
                let value: string | number = kvMatch[2].replace(/^['"]|['"]$/g, '')
                if (kvMatch[1] === 'order' && /^\d+$/.test(value)) {
                  value = parseInt(value, 10)
                }
                frontmatter[kvMatch[1]] = value
              }
            }
          }
        }
      }
      
      // Default title from filename if not in frontmatter
      if (!frontmatter.title) {
        frontmatter.title = baseName.charAt(0).toUpperCase() + baseName.slice(1)
      }
      
      // Compute URL path
      let urlPath = options.filePath
        .replace(options.docsDir, '')
        .replace(/^[\/\\]/, '')
        .replace(/\.(mdx?|md)$/, '')
        .replace(/\\/g, '/')
      
      if (urlPath.endsWith('/index') || urlPath === 'index') {
        urlPath = urlPath.replace(/\/?index$/, '')
      }
      
      const base = (options.basePath || '').replace(/\/$/, '')
      urlPath = urlPath ? `${base}/${urlPath}` : base || '/'
      
      return {
        urlPath,
        htmlContent: `<h1>${frontmatter.title}</h1>\n<p>Compiled MDX content for ${baseName}</p>`,
        liquidContent: `{% assign page_title = "${frontmatter.title}" %}\n<h1>${frontmatter.title}</h1>`,
        frontmatter: frontmatter as any,
        toc: [
          { depth: 1, text: String(frontmatter.title), slug: baseName.toLowerCase() }
        ],
        demos: [],
      }
    }),
  }
}

// =============================================================================
// Tests
// =============================================================================

describe('MdxService', () => {
  let service: MdxService
  let mockFs: ReturnType<typeof createMockFileSystem>
  let mockCompiler: ReturnType<typeof createMockCompiler>
  let context: MdxServiceContext
  
  beforeEach(() => {
    mockFs = createMockFileSystem()
    mockCompiler = createMockCompiler(mockFs)
    context = createMockContext()
    service = new MdxService({ 
      fileSystem: mockFs as unknown as MdxFileSystem,
      compiler: mockCompiler,
    })
  })
  
  // ===========================================================================
  // Metadata Tests
  // ===========================================================================
  
  describe('metadata', () => {
    it('should have correct name', () => {
      expect(service.name).toBe('MdxService')
    })
    
    it('should have semantic version', () => {
      expect(service.version).toMatch(/^\d+\.\d+\.\d+$/)
    })
    
    it('should declare dependencies', () => {
      expect(service.dependencies).toBeInstanceOf(Array)
      expect(service.dependencies).toContain('HtmlConverterService')
    })
  })
  
  // ===========================================================================
  // Initialize Tests
  // ===========================================================================
  
  describe('initialize', () => {
    it('should initialize without error', async () => {
      await service.initialize(context)
      // If we get here, no error was thrown
      expect(true).toBe(true)
    })
    
    it('should log debug message on initialize', async () => {
      await service.initialize(context)
      
      expect(context.logger.debug).toHaveBeenCalledWith('MdxService initialized')
    })
    
    it('should work with minimal context', async () => {
      const minimalContext: MdxServiceContext = {
        logger: createMockLogger(),
      }
      
      await service.initialize(minimalContext)
      // If we get here, no error was thrown
      expect(true).toBe(true)
    })
  })
  
  // ===========================================================================
  // Execute Tests - Error Handling
  // ===========================================================================
  
  describe('execute - error handling', () => {
    it('should throw if not initialized', async () => {
      await expect(service.execute({
        docsDir: './docs',
        outputDir: './dist',
      })).rejects.toThrow('MdxService not initialized')
    })
    
    it('should handle empty docs directory gracefully', async () => {
      await service.initialize(context)
      
      // Empty directory - no files
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(result.pages).toBe(0)
      expect(result.navigation).toEqual([])
      expect(result.generatedPages).toEqual([])
    })
  })
  
  // ===========================================================================
  // Execute Tests - MDX Scanning
  // ===========================================================================
  
  describe('execute - MDX scanning', () => {
    beforeEach(async () => {
      await service.initialize(context)
    })
    
    it('should find MDX files in docs directory', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\n---\n# Home')
      mockFs.files.set('./docs/guide.mdx', '---\ntitle: Guide\n---\n# Guide')
      
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(result.pages).toBe(2)
    })
    
    it('should find MDX files in nested directories', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\n---')
      mockFs.files.set('./docs/components/index.mdx', '---\ntitle: Components\n---')
      mockFs.files.set('./docs/components/button.mdx', '---\ntitle: Button\n---')
      
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(result.pages).toBe(3)
    })
    
    it('should handle .md files as well as .mdx', async () => {
      mockFs.files.set('./docs/readme.md', '---\ntitle: README\n---')
      mockFs.files.set('./docs/guide.mdx', '---\ntitle: Guide\n---')
      
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(result.pages).toBe(2)
    })
  })
  
  // ===========================================================================
  // Execute Tests - URL Generation
  // ===========================================================================
  
  describe('execute - URL generation', () => {
    beforeEach(async () => {
      await service.initialize(context)
    })
    
    it('should convert index.mdx to root URL', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\n---')
      
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(result.generatedPages[0].urlPath).toBe('/')
    })
    
    it('should convert nested files to URL paths', async () => {
      mockFs.files.set('./docs/components/button.mdx', '---\ntitle: Button\n---')
      
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(result.generatedPages[0].urlPath).toBe('/components/button')
    })
    
    it('should apply basePath prefix', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\n---')
      mockFs.files.set('./docs/guide.mdx', '---\ntitle: Guide\n---')
      
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
        basePath: '/docs',
      })
      
      const urls = result.generatedPages.map(p => p.urlPath)
      expect(urls).toContain('/docs')
      expect(urls).toContain('/docs/guide')
    })
    
    it('should convert directory index.mdx to directory URL', async () => {
      mockFs.files.set('./docs/components/index.mdx', '---\ntitle: Components\n---')
      
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(result.generatedPages[0].urlPath).toBe('/components')
    })
  })
  
  // ===========================================================================
  // Execute Tests - Frontmatter Parsing
  // ===========================================================================
  
  describe('execute - frontmatter parsing', () => {
    beforeEach(async () => {
      await service.initialize(context)
    })
    
    it('should extract title from frontmatter', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: My Documentation\n---\n# Content')
      
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(result.generatedPages[0].title).toBe('My Documentation')
    })
    
    it('should handle missing frontmatter', async () => {
      mockFs.files.set('./docs/index.mdx', '# Just a heading\n\nSome content')
      
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      // Should fall back to filename-based title ('Index' from index.mdx)
      expect(result.generatedPages[0].title).toBe('Index')
    })
    
    it('should parse order as number', async () => {
      mockFs.files.set('./docs/first.mdx', '---\ntitle: First\norder: 1\n---')
      mockFs.files.set('./docs/second.mdx', '---\ntitle: Second\norder: 2\n---')
      
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      // Navigation should be sorted by order
      expect(result.navigation[0].title).toBe('First')
      expect(result.navigation[1].title).toBe('Second')
    })
  })
  
  // ===========================================================================
  // Execute Tests - HTML Generation
  // ===========================================================================
  
  describe('execute - HTML generation', () => {
    beforeEach(async () => {
      await service.initialize(context)
    })
    
    it('should write HTML files', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\n---')
      
      await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(mockFs.writeFile).toHaveBeenCalled()
      expect(mockFs.files.has('./dist/html/index.html')).toBe(true)
    })
    
    it('should write nested HTML files', async () => {
      mockFs.files.set('./docs/components/button.mdx', '---\ntitle: Button\n---')
      
      await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(mockFs.files.has('./dist/html/components/button/index.html')).toBe(true)
    })
    
    it('should include title in generated HTML', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: My Page Title\n---')
      
      // Configure mock compiler to return specific frontmatter
      mockCompiler.compileMdxFile.mockImplementationOnce(async () => ({
        urlPath: '/',
        htmlContent: '<h1>My Page Title</h1>\n<p>Content</p>',
        liquidContent: '',
        frontmatter: { title: 'My Page Title' },
        toc: [],
        demos: [],
      }))
      
      await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      const html = mockFs.files.get('./dist/html/index.html')
      expect(html).toContain('<title>My Page Title</title>')
      expect(html).toContain('<h1>My Page Title</h1>')
    })
    
    it('should include description in meta tag', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\ndescription: Welcome to docs\n---')
      
      // Configure mock compiler to return specific frontmatter with description
      mockCompiler.compileMdxFile.mockImplementationOnce(async () => ({
        urlPath: '/',
        htmlContent: '<h1>Home</h1>',
        liquidContent: '',
        frontmatter: { title: 'Home', description: 'Welcome to docs' },
        toc: [],
        demos: [],
      }))
      
      await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      const html = mockFs.files.get('./dist/html/index.html')
      expect(html).toContain('name="description" content="Welcome to docs"')
    })
    
    it('should escape HTML in frontmatter values', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Test <script>alert("xss")</script>\n---')
      
      // Configure mock compiler to return XSS attempt in title
      mockCompiler.compileMdxFile.mockImplementationOnce(async () => ({
        urlPath: '/',
        htmlContent: '<h1>Test</h1>',
        liquidContent: '',
        frontmatter: { title: 'Test <script>alert("xss")</script>' },
        toc: [],
        demos: [],
      }))
      
      await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      const html = mockFs.files.get('./dist/html/index.html')
      // Title in <title> tag should be escaped
      expect(html).toContain('&lt;script&gt;')
    })
    
    it('should use data-class in tailwind mode', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\n---')
      
      await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
        htmlMode: 'tailwind',
      })
      
      const html = mockFs.files.get('./dist/html/index.html')
      expect(html).toContain('data-class="docs-page"')
    })
    
    it('should use class in semantic mode', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\n---')
      
      await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
        htmlMode: 'semantic',
      })
      
      const html = mockFs.files.get('./dist/html/index.html')
      expect(html).toContain('class="docs-page"')
      expect(html).not.toContain('data-class')
    })
    
    it('should call compiler for each MDX file', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\n---')
      mockFs.files.set('./docs/guide.mdx', '---\ntitle: Guide\n---')
      
      await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(mockCompiler.compileMdxFile).toHaveBeenCalledTimes(2)
    })
    
    it('should pass correct options to compiler', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\n---')
      
      await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
        basePath: '/docs',
        htmlMode: 'semantic',
        toc: { minLevel: 2, maxLevel: 4 },
      })
      
      expect(mockCompiler.compileMdxFile).toHaveBeenCalledWith(
        expect.objectContaining({
          docsDir: './docs',
          basePath: '/docs',
          htmlMode: 'semantic',
          tocConfig: { minLevel: 2, maxLevel: 4 },
        })
      )
    })
    
    it('should include compiled HTML content in output', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\n---')
      
      mockCompiler.compileMdxFile.mockImplementationOnce(async () => ({
        urlPath: '/',
        htmlContent: '<h1>Custom Heading</h1>\n<p>Custom paragraph content.</p>',
        liquidContent: '',
        frontmatter: { title: 'Home' },
        toc: [],
        demos: [],
      }))
      
      await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      const html = mockFs.files.get('./dist/html/index.html')
      expect(html).toContain('<h1>Custom Heading</h1>')
      expect(html).toContain('<p>Custom paragraph content.</p>')
    })
    
    it('should generate TOC sidebar when toc is present', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\n---')
      
      mockCompiler.compileMdxFile.mockImplementationOnce(async () => ({
        urlPath: '/',
        htmlContent: '<h1>Home</h1>',
        liquidContent: '',
        frontmatter: { title: 'Home' },
        toc: [
          { depth: 2, text: 'Getting Started', slug: 'getting-started' },
          { depth: 2, text: 'Installation', slug: 'installation' },
        ],
        demos: [],
      }))
      
      await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      const html = mockFs.files.get('./dist/html/index.html')
      expect(html).toContain('docs-toc')
      expect(html).toContain('href="#getting-started"')
      expect(html).toContain('href="#installation"')
    })
    
    it('should generate fallback page on compilation error', async () => {
      mockFs.files.set('./docs/broken.mdx', '---\ntitle: Broken Page\n---\nInvalid MDX')
      
      mockCompiler.compileMdxFile.mockRejectedValueOnce(new Error('MDX compilation failed: syntax error'))
      
      await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      const html = mockFs.files.get('./dist/html/broken/index.html')
      expect(html).toContain('<title>Broken Page</title>')
      expect(html).toContain('error-notice')
      expect(html).toContain('MDX compilation failed')
    })
  })
  
  // ===========================================================================
  // Execute Tests - Navigation Generation
  // ===========================================================================
  
  describe('execute - navigation generation', () => {
    beforeEach(async () => {
      await service.initialize(context)
    })
    
    it('should generate navigation array', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\n---')
      mockFs.files.set('./docs/guide.mdx', '---\ntitle: Guide\n---')
      
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(result.navigation).toHaveLength(2)
      expect(result.navigation[0]).toMatchObject({
        title: expect.any(String),
        path: expect.any(String),
      })
    })
    
    it('should sort navigation by order', async () => {
      mockFs.files.set('./docs/zebra.mdx', '---\ntitle: Zebra\norder: 3\n---')
      mockFs.files.set('./docs/apple.mdx', '---\ntitle: Apple\norder: 1\n---')
      mockFs.files.set('./docs/banana.mdx', '---\ntitle: Banana\norder: 2\n---')
      
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(result.navigation[0].title).toBe('Apple')
      expect(result.navigation[1].title).toBe('Banana')
      expect(result.navigation[2].title).toBe('Zebra')
    })
    
    it('should write navigation JSON when navOutput specified', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\n---')
      
      await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
        navOutput: './dist/docs-nav.json',
      })
      
      expect(mockFs.files.has('./dist/docs-nav.json')).toBe(true)
      
      const navJson = JSON.parse(mockFs.files.get('./dist/docs-nav.json')!)
      expect(navJson.items).toHaveLength(1)
      expect(navJson.generated).toBeDefined()
    })
  })
  
  // ===========================================================================
  // Execute Tests - Events
  // ===========================================================================
  
  describe('execute - events', () => {
    beforeEach(async () => {
      await service.initialize(context)
    })
    
    it('should emit mdx:page:generated for each page', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\n---')
      mockFs.files.set('./docs/guide.mdx', '---\ntitle: Guide\n---')
      
      await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(context.eventBus!.emit).toHaveBeenCalledWith(
        'mdx:page:generated',
        expect.objectContaining({
          urlPath: expect.any(String),
          outputPath: expect.any(String),
        })
      )
      
      // Should be called once per page
      const pageCalls = (context.eventBus!.emit as ReturnType<typeof vi.fn>).mock.calls
        .filter(call => call[0] === 'mdx:page:generated')
      expect(pageCalls).toHaveLength(2)
    })
    
    it('should emit mdx:complete event', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\n---')
      
      await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(context.eventBus!.emit).toHaveBeenCalledWith(
        'mdx:complete',
        expect.objectContaining({
          pages: 1,
          duration: expect.any(Number),
        })
      )
    })
  })
  
  // ===========================================================================
  // Execute Tests - Output
  // ===========================================================================
  
  describe('execute - output', () => {
    beforeEach(async () => {
      await service.initialize(context)
    })
    
    it('should return correct page count', async () => {
      mockFs.files.set('./docs/one.mdx', '---\ntitle: One\n---')
      mockFs.files.set('./docs/two.mdx', '---\ntitle: Two\n---')
      mockFs.files.set('./docs/three.mdx', '---\ntitle: Three\n---')
      
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(result.pages).toBe(3)
    })
    
    it('should return duration', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\n---')
      
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(result.duration).toBeGreaterThanOrEqual(0)
    })
    
    it('should return generated pages list', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home Page\n---')
      
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
      })
      
      expect(result.generatedPages).toHaveLength(1)
      expect(result.generatedPages[0]).toMatchObject({
        urlPath: '/',
        outputPath: expect.stringContaining('index.html'),
        title: 'Home Page',
      })
    })
    
    it('should return navigation with paths including basePath', async () => {
      mockFs.files.set('./docs/index.mdx', '---\ntitle: Home\n---')
      mockFs.files.set('./docs/guide.mdx', '---\ntitle: Guide\n---')
      
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
        basePath: '/docs',
      })
      
      expect(result.navigation).toHaveLength(2)
      expect(result.navigation.map(n => n.path)).toContain('/docs')
      expect(result.navigation.map(n => n.path)).toContain('/docs/guide')
    })
  })
  
  // ===========================================================================
  // Dispose Tests
  // ===========================================================================
  
  describe('dispose', () => {
    it('should dispose without error', async () => {
      await service.initialize(context)
      
      await service.dispose()
      // If we get here, no error was thrown
      expect(true).toBe(true)
    })
    
    it('should reset initialized state', async () => {
      await service.initialize(context)
      await service.dispose()
      
      // Should throw because not initialized
      await expect(service.execute({
        docsDir: './docs',
        outputDir: './dist',
      })).rejects.toThrow('MdxService not initialized')
    })
  })
  
  // ===========================================================================
  // Integration Tests
  // ===========================================================================
  
  describe('integration', () => {
    it('should handle full workflow', async () => {
      // Setup docs structure
      mockFs.files.set('./docs/index.mdx', `---
title: Documentation
description: Welcome to our docs
order: 1
---

# Documentation

Welcome to the documentation.`)
      
      mockFs.files.set('./docs/getting-started.mdx', `---
title: Getting Started
description: Quick start guide
order: 2
---

# Getting Started

Follow these steps...`)
      
      mockFs.files.set('./docs/components/index.mdx', `---
title: Components
description: UI component library
order: 3
---

# Components

Browse our components.`)
      
      mockFs.files.set('./docs/components/button.mdx', `---
title: Button
description: Button component
order: 1
---

# Button

A clickable button.`)
      
      // Initialize and execute
      await service.initialize(context)
      
      const result = await service.execute({
        docsDir: './docs',
        outputDir: './dist/html',
        basePath: '/docs',
        navOutput: './dist/docs-nav.json',
        verbose: true,
      })
      
      // Verify results
      expect(result.pages).toBe(4)
      expect(result.navigation).toHaveLength(4)
      
      // Verify files were written
      expect(mockFs.files.has('./dist/html/docs/index.html')).toBe(true)
      expect(mockFs.files.has('./dist/html/docs/getting-started/index.html')).toBe(true)
      expect(mockFs.files.has('./dist/html/docs/components/index.html')).toBe(true)
      expect(mockFs.files.has('./dist/html/docs/components/button/index.html')).toBe(true)
      expect(mockFs.files.has('./dist/docs-nav.json')).toBe(true)
      
      // Verify navigation is sorted by order
      const docNav = result.navigation.find(n => n.title === 'Documentation')
      const guideNav = result.navigation.find(n => n.title === 'Getting Started')
      expect(docNav).toBeDefined()
      expect(guideNav).toBeDefined()
      expect(docNav!.order).toBe(1)
      expect(guideNav!.order).toBe(2)
    })
  })
})
