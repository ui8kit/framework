// @ts-nocheck
/**
 * RouteToStatic - OOP TypeScript script for generating static HTML from React Vite projects
 * 
 * This script extracts routes from createBrowserRouter configuration and generates
 * static HTML files using renderToStaticMarkup. Each route path becomes a folder
 * with an index.html file inside.
 * 
 * Usage example:
 * ```ts
 * import { RouteToStatic } from './routeToStatic'
 * 
 * const generator = new RouteToStatic()
 * generator.configure({
 *   entryPath: 'apps/vite/src/main.tsx',
 *   outputDir: 'apps/create-html/html',
 *   cssSources: ['apps/vite/src/assets/css'],
 *   title: 'My App',
 *   dataModulePath: 'apps/vite/src/data/index.ts' // Optional: for dynamic routes
 * })
 * await generator.generateAll()
 * 
 * // Or generate a single route:
 * await generator.generateRoute('/about')
 * ```
 * 
 * bun scripts/routeToStatic.tsx
 */
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { writeFileSync, mkdirSync, existsSync, cpSync, readdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'
import { pathToFileURL } from 'url'
import pretty from 'pretty'
import { parse } from 'parse5'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider, lesseUITheme } from '../../../apps/local/src/providers/theme'

type RouteToStaticConfig = {
  entryPath: string
  outputDir: string
  cssSources?: string[]
  title?: string
  dataModulePath?: string
}

type RouteInfo = {
  path: string
  componentName: string
}

class RouteToStatic {
  private config: RouteToStaticConfig | null = null
  private importsMap: Map<string, { specifier: string; isNamed: boolean }> = new Map()
  private routesMap: Map<string, string> = new Map()
  private AppComponent: any = null
  private renderContext: any = null

  /**
   * Configure the generator with required settings
   */
  configure(config: RouteToStaticConfig): RouteToStatic {
    this.config = config
    return this
  }

  /**
   * Generate static HTML for all routes
   */
  async generateAll(): Promise<void> {
    if (!this.config) {
      throw new Error('Configuration is required. Call configure() first.')
    }

    const { entryPath, outputDir, cssSources, title, dataModulePath } = this.config
    console.log(`📄 Rendering ${entryPath} to static HTML...`)

    const absEntryPath = join(process.cwd(), entryPath)
    const entryDir = dirname(absEntryPath)
    const fileContent = readFileSync(absEntryPath, 'utf8')

    // Parse imports and routes from router file
    this.importsMap = this.parseDefaultImports(fileContent)
    this.routesMap = this.parseChildrenRoutes(fileContent)

    // Resolve root App component
    this.AppComponent = await this.resolveRootAppComponentFromEntry(absEntryPath)

    // Load render context for dynamic routes if provided
    if (dataModulePath) {
      try {
        const dataModule = await import(pathToFileURL(join(process.cwd(), dataModulePath)).href)
        this.renderContext = dataModule.renderContext
      } catch (error) {
        console.warn(`⚠️  Could not load data module: ${dataModulePath}`, error)
      }
    }

    // Generate HTML for each route
    for (const [routePath, componentName] of this.routesMap.entries()) {
      // Skip wildcard catch-all routes
      if (componentName === 'NotFound' || routePath.includes('*')) {
        continue
      }

      const importInfo = this.importsMap.get(componentName)
      if (!importInfo) {
        console.warn(`⚠️  Skipping route ${routePath}: no import for ${componentName}`)
        continue
      }

      const absModulePath = this.resolveImportPath(entryDir, importInfo.specifier)
      const moduleUrl = pathToFileURL(absModulePath).href
      const mod = await import(moduleUrl)
      const RouteComponent = importInfo.isNamed ? mod[componentName] : mod.default

      if (!RouteComponent) {
        console.warn(`⚠️  Skipping route ${routePath}: ${importInfo.isNamed ? 'named' : 'default'} export missing in ${absModulePath}`)
        continue
      }

      // Handle dynamic routes
      if (routePath.includes('/:')) {
        const slugs = this.getDynamicSlugsForRoute(routePath)
        for (const slug of slugs) {
          const concretePath = routePath.replace('/:slug', `/${slug}`)
          await this.renderRouteToFile(
            this.normalizeRoutePath(concretePath),
            RouteComponent,
            outputDir,
            title,
            routePath,
            this.AppComponent
          )
        }
      } else {
        // Static route
        await this.renderRouteToFile(
          this.normalizeRoutePath(routePath),
          RouteComponent,
          outputDir,
          title,
          undefined,
          this.AppComponent
        )
      }
    }

    // Copy CSS files if configured
    if (cssSources && cssSources.length > 0) {
      console.log('📁 Copying CSS...')
      this.copyCssToAssets(outputDir, cssSources)
    } else {
      console.log('ℹ️  Skipping CSS copy (no cssSources configured)')
    }

    console.log('✅ Static site generation completed!')
  }

  /**
   * Generate static HTML for a single route
   */
  async generateRoute(path: string): Promise<void> {
    if (!this.config) {
      throw new Error('Configuration is required. Call configure() first.')
    }

    const { entryPath, outputDir, cssSources, title } = this.config
    console.log(`📄 Rendering ${entryPath} to static HTML for route: ${path}`)

    const absEntryPath = join(process.cwd(), entryPath)
    const normalizedPath = this.normalizeRoutePath(path)

    // Resolve route component
    const RouteComponent = await this.resolveRouteComponentFromEntry(absEntryPath, path)
    if (!RouteComponent) {
      throw new Error(`Unable to resolve component to render for ${path} in ${entryPath}`)
    }

    // Resolve App component if available
    let AppComponent: any
    try {
      AppComponent = await this.resolveRootAppComponentFromEntry(absEntryPath)
    } catch {
      // App component not required for single route generation
      AppComponent = null
    }

    // Derive pattern path for dynamic routes
    const routePatternPath = this.derivePatternFromConcretePath(normalizedPath)

    // Render route
    await this.renderRouteToFile(
      normalizedPath,
      RouteComponent,
      outputDir,
      title,
      routePatternPath,
      AppComponent
    )

    // Copy CSS files if configured
    if (cssSources && cssSources.length > 0) {
      console.log('📁 Copying CSS...')
      this.copyCssToAssets(outputDir, cssSources)
    }

    console.log(`✅ Generated: ${path}`)
  }

  /**
   * Render a single route to HTML file
   */
  private async renderRouteToFile(
    normalizedPath: string,
    RouteComponent: any,
    outputDir: string,
    title?: string,
    routePatternPath?: string,
    AppComponent?: any
  ): Promise<void> {
    const appElement = AppComponent
      ? React.createElement(
          ThemeProvider,
          { theme: lesseUITheme },
          this.createRouterElementForPath(AppComponent, RouteComponent, normalizedPath, routePatternPath)
        )
      : React.createElement(
          ThemeProvider,
          { theme: lesseUIThemee },
          React.createElement(RouteComponent)
        )

    const content = renderToStaticMarkup(appElement)
    const fullPath = normalizedPath === '/'
      ? join(outputDir, 'index.html')
      : join(outputDir, normalizedPath.replace(/^\//, ''), 'index.html')
    const dirPath = dirname(fullPath)

    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true })
    }

    writeFileSync(fullPath, this.createHTMLDocument(content, title))
    console.log(`✅ Generated: ${fullPath}`)
  }

  /**
   * Create router element for a specific path
   * This ensures Router context is properly set up for components using Link, useNavigate, etc.
   */
  private createRouterElementForPath(
    AppComponent: any,
    RouteComponent: any,
    normalizedPath: string,
    routePatternPath?: string
  ): React.ReactElement {
    const childRoute = normalizedPath === '/'
      ? { index: true, element: React.createElement(RouteComponent) }
      : { path: (routePatternPath || normalizedPath).replace(/^\//, ''), element: React.createElement(RouteComponent) }

    const router = createMemoryRouter([
      {
        path: '/',
        element: React.createElement(AppComponent),
        children: [childRoute],
      },
    ], {
      initialEntries: [normalizedPath],
    })

    return React.createElement(RouterProvider, { router })
  }

  /**
   * Encode HTML attribute values
   */
  private encodeAttr(val?: string): string {
    if (!val) return ''
    return val.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  /**
   * Extract SEO metadata from content
   */
  private extractSeoFromContent(content: string): { title?: string; description?: string } {
    try {
      const doc: any = parse(`<body>${content}</body>`)
      let foundTitle: string | undefined
      let foundDesc: string | undefined

      const getText = (n: any): string => {
        if (!n) return ''
        if (n.nodeName === '#text') return String(n.value || '').trim()
        const children = n.childNodes || []
        let out = ''
        for (const c of children) {
          const t = getText(c)
          if (t) out += (out ? ' ' : '') + t
        }
        return out.trim()
      }

      const walk = (n: any) => {
        if (!n || (foundTitle && foundDesc)) return
        const tag = n.tagName
        if (!foundTitle && (tag === 'h1' || tag === 'h2' || tag === 'h3')) {
          const t = getText(n)
          if (t) foundTitle = t
        }
        if (!foundDesc && tag === 'p') {
          const t = getText(n)
          if (t && t.length >= 40) foundDesc = t
        }
        const children = n.childNodes || []
        for (const c of children) walk(c)
      }

      walk(doc)
      return { title: foundTitle, description: foundDesc }
    } catch {
      return {}
    }
  }

  /**
   * Create HTML document with content
   */
  private createHTMLDocument(content: string, title = 'App'): string {
    const seo = this.extractSeoFromContent(content)
    const pageTitle = seo.title || title
    const pageDesc = seo.description
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${this.encodeAttr(pageTitle)}</title>
  ${pageDesc ? `<meta name=\"description\" content=\"${this.encodeAttr(pageDesc)}\">` : ''}
  <meta property="og:title" content="${this.encodeAttr(pageTitle)}">
  ${pageDesc ? `<meta property=\"og:description\" content=\"${this.encodeAttr(pageDesc)}\">` : ''}
  <link rel="stylesheet" href="styles.css">
  <!-- script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script -->
  <script>
    // Initialize dark mode before React loads to prevent flash
    (function() {
      const stored = localStorage.getItem('ui:dark');
      let isDark = false;
      
      if (stored !== null) {
        isDark = stored === '1';
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        isDark = true;
      }
      
      if (isDark) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    })();
  </script>
  <script>
    // Add click handler for dark mode toggle button (for static HTML)
    document.addEventListener('DOMContentLoaded', function() {
      const toggleButton = document.querySelector('button[title="Toggle dark mode"]');
      if (toggleButton) {
        toggleButton.addEventListener('click', function() {
          const isDark = document.documentElement.classList.contains('dark');
          const newIsDark = !isDark;
          
          // Update DOM
          if (newIsDark) {
            document.documentElement.classList.add('dark');
            document.documentElement.style.colorScheme = 'dark';
          } else {
            document.documentElement.classList.remove('dark');
            document.documentElement.style.colorScheme = 'light';
          }
          
          // Update localStorage (matches ui8kit useTheme hook)
          try {
            localStorage.setItem('ui:dark', newIsDark ? '1' : '0');
          } catch (e) {
            console.warn('Failed to save theme preference:', e);
          }
          
          // Update button icon (Moon/Sun)
          // Moon icon: M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z
          // Sun icon: M12 3V1m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z
          const svg = toggleButton.querySelector('svg');
          if (svg) {
            const path = svg.querySelector('path');
            if (path) {
              // Swap between Moon and Sun icons
              if (newIsDark) {
                // Dark mode: show Sun icon
                path.setAttribute('d', 'M12 3V1m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Z');
              } else {
                // Light mode: show Moon icon
                path.setAttribute('d', 'M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z');
              }
            }
          }
        });
      }
    });
  </script>
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMGJiYTciIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0ibHVjaWRlIGx1Y2lkZS1ib3gtaWNvbiBsdWNpZGUtYm94Ij48cGF0aCBkPSJNMjEgOGEyIDIgMCAwIDAtMS0xLjczbC03LTRhMiAyIDAgMCAwLTIgMGwtNyA0QTIgMiAwIDAgMCAzIDh2OGEyIDIgMCAwIDAgMSAxLjczbDcgNGEyIDIgMCAwIDAgMiAwbDctNEEyIDIgMCAwIDAgMjEgMTZaIi8+PHBhdGggZD0ibTMuMyA3IDguNyA1IDguNy01Ii8+PHBhdGggZD0iTTEyIDIyVjEyIi8+PC9zdmc+" />
</head>
<body class="bg-background text-foreground">
  ${content}
</body>
</html>`

    return pretty(html, { ocd: true })
  }

  /**
   * Copy CSS files to assets directory
   */
  private copyCssToAssets(targetRoot: string, cssPaths: string[]): void {
    const assetsCssDir = join(targetRoot, 'assets', 'css')
    if (!existsSync(assetsCssDir)) {
      mkdirSync(assetsCssDir, { recursive: true })
    }

    for (const relPath of cssPaths) {
      const absPath = join(process.cwd(), relPath)
      if (!existsSync(absPath)) continue

      try {
        // If path is a directory, pick first .css file inside
        const listing = readdirSync(absPath)
        const cssFile = listing.find((f: string) => f.endsWith('.css'))
        if (cssFile) {
          const sourceCssPath = join(absPath, cssFile)
          const targetCssPath = join(assetsCssDir, 'styles.css')
          cpSync(sourceCssPath, targetCssPath)
          console.log(`✅ Copied: ${sourceCssPath} -> ${targetCssPath}`)
          return
        }
      } catch (_) {
        // Not a directory, try as file
        if (absPath.endsWith('.css')) {
          const targetCssPath = join(assetsCssDir, 'styles.css')
          cpSync(absPath, targetCssPath)
          console.log(`✅ Copied: ${absPath} -> ${targetCssPath}`)
          return
        }
      }
    }

    console.warn('⚠️  No CSS source found in provided cssSources')
  }

  /**
   * Normalize route path
   */
  private normalizeRoutePath(routePath?: string): string {
    if (!routePath || routePath === '/') return '/'
    // Accept both 'about' and '/about'
    return routePath.startsWith('/') ? routePath : `/${routePath}`
  }

  /**
   * Parse imports from source code (supports both default and named imports)
   * Returns a map of component name -> { specifier, isNamed }
   */
  private parseDefaultImports(source: string): Map<string, { specifier: string; isNamed: boolean }> {
    const map = new Map<string, { specifier: string; isNamed: boolean }>()
    
    // Match default imports: import Component from 'path'
    const defaultImportRegex = /import\s+([A-Za-z0-9_]+)\s+from\s+['"]([^'\"]+)['"];?/g
    let match: RegExpExecArray | null
    while ((match = defaultImportRegex.exec(source)) !== null) {
      const name = match[1]
      const spec = match[2]
      map.set(name, { specifier: spec, isNamed: false })
    }
    
    // Match named imports: import { Component } from 'path' or import { Component1, Component2 } from 'path'
    const namedImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'\"]+)['"];?/g
    while ((match = namedImportRegex.exec(source)) !== null) {
      const importsList = match[1]
      const spec = match[2]
      // Extract individual component names from the list
      const componentNames = importsList.split(',').map(name => name.trim()).filter(name => name.length > 0)
      for (const name of componentNames) {
        map.set(name, { specifier: spec, isNamed: true })
      }
    }
    
    return map
  }

  /**
   * Parse children routes from router configuration
   */
  private parseChildrenRoutes(source: string): Map<string, string> {
    const map = new Map<string, string>()
    // Capture entries inside children: [ ... ] blocks
    const childrenBlockRegex = /children:\s*\[([\s\S]*?)\]/m
    const blockMatch = childrenBlockRegex.exec(source)
    if (!blockMatch) return map
    const block = blockMatch[1]

    // Match either { index: true, element: <Home /> } OR { path: 'about', element: <About /> }
    const routeEntryRegex = /\{\s*(index:\s*true|path:\s*['"]([^'"]+)['"])\s*,\s*element:\s*<\s*([A-Za-z0-9_]+)\s*\/>/g
    let m: RegExpExecArray | null
    while ((m = routeEntryRegex.exec(block)) !== null) {
      const isIndex = m[1] && m[1].includes('index')
      const pathVal = isIndex ? '/' : `/${m[2]}`
      const componentName = m[3]
      map.set(pathVal, componentName)
    }
    return map
  }

  /**
   * Resolve import path to actual file path
   */
  private resolveImportPath(entryDir: string, specifier: string): string {
    let base: string
    if (specifier.startsWith('@/')) {
      // '@' alias points to the src dir of the app, assume relative to entry file dir
      base = join(entryDir, specifier.slice(2))
    } else if (specifier.startsWith('./') || specifier.startsWith('../')) {
      base = join(entryDir, specifier)
    } else {
      // Not a file import we can resolve (library). Fail early.
      throw new Error(`Unsupported import specifier for route component: ${specifier}`)
    }

    const candidates = [
      `${base}.tsx`,
      `${base}.ts`,
      `${base}.jsx`,
      `${base}.js`,
      join(base, 'index.tsx'),
      join(base, 'index.ts'),
      join(base, 'index.jsx'),
      join(base, 'index.js'),
    ]
    const found = candidates.find((p) => existsSync(p))
    if (!found) {
      throw new Error(`Unable to resolve file for import ${specifier}. Tried: ${candidates.join(', ')}`)
    }
    return found
  }

  /**
   * Resolve route component from entry file
   */
  private async resolveRouteComponentFromEntry(absEntryPath: string, routePath: string): Promise<any> {
    const entryDir = dirname(absEntryPath)
    const fileContent = readFileSync(absEntryPath, 'utf8')

    const importsMap = this.parseDefaultImports(fileContent)
    const routeToComponent = this.parseChildrenRoutes(fileContent)

    const normalized = this.normalizeRoutePath(routePath)
    const componentName = routeToComponent.get(normalized)
    if (!componentName) {
      throw new Error(`Route path not found in router: ${normalized}`)
    }

    const importInfo = importsMap.get(componentName)
    if (!importInfo) {
      throw new Error(`Import for component ${componentName} not found in entry file`)
    }

    const absModulePath = this.resolveImportPath(entryDir, importInfo.specifier)
    const moduleUrl = pathToFileURL(absModulePath).href
    const mod = await import(moduleUrl)
    return importInfo.isNamed ? mod[componentName] : mod.default
  }

  /**
   * Resolve root App component from entry file
   */
  private async resolveRootAppComponentFromEntry(absEntryPath: string): Promise<any> {
    const entryDir = dirname(absEntryPath)
    const fileContent = readFileSync(absEntryPath, 'utf8')
    const importsMap = this.parseDefaultImports(fileContent)
    const appName = this.parseRootElementName(fileContent)
    if (!appName) {
      throw new Error('Root route element not found in router (expected element: <App />)')
    }
    const importInfo = importsMap.get(appName)
    if (!importInfo) {
      throw new Error(`Import for root element ${appName} not found in entry file`)
    }
    const absModulePath = this.resolveImportPath(entryDir, importInfo.specifier)
    const moduleUrl = pathToFileURL(absModulePath).href
    const mod = await import(moduleUrl)
    return importInfo.isNamed ? mod[appName] : mod.default
  }

  /**
   * Parse root element name from router configuration
   */
  private parseRootElementName(source: string): string | null {
    // Heuristic: find first element: <X /> before children: [ inside createBrowserRouter([...])
    const regex = /createBrowserRouter\(\[\s*\{[\s\S]*?element:\s*<\s*([A-Za-z0-9_]+)\s*\/>[\s\S]*?children\s*:\s*\[/m
    const m = regex.exec(source)
    return m ? m[1] : null
  }

  /**
   * Get dynamic slugs for a route pattern
   */
  private getDynamicSlugsForRoute(routePath: string): string[] {
    if (!this.renderContext) {
      console.warn(`⚠️  No render context available for dynamic route: ${routePath}`)
      return []
    }

    if (routePath.includes('/posts/:slug')) {
      return (this.renderContext.posts?.posts || []).map((p: any) => p.slug)
    }
    if (routePath.includes('/category/:slug')) {
      return (this.renderContext.categories || []).map((c: any) => c.slug)
    }
    if (routePath.includes('/tag/:slug')) {
      return (this.renderContext.tags || []).map((t: any) => t.slug)
    }
    if (routePath.includes('/author/:slug')) {
      return (this.renderContext.authors || []).map((a: any) => a.slug)
    }
    return []
  }

  /**
   * Derive route pattern from concrete path
   */
  private derivePatternFromConcretePath(concretePath: string): string | undefined {
    if (/^\/posts\/.+/.test(concretePath)) return '/posts/:slug'
    if (/^\/category\/.+/.test(concretePath)) return '/category/:slug'
    if (/^\/tag\/.+/.test(concretePath)) return '/tag/:slug'
    if (/^\/author\/.+/.test(concretePath)) return '/author/:slug'
    return undefined
  }
}

// Export singleton instance with fluent API
export const routeToStatic = new RouteToStatic()

// Export class for custom instances
export { RouteToStatic }

// Example usage:
// const generator = new RouteToStatic()
// generator.configure({
//   entryPath: 'apps/vite/src/main.tsx',
//   outputDir: 'apps/create-html/html',
//   cssSources: ['apps/vite/src/assets/css'],
//   title: 'My App',
//   dataModulePath: 'apps/vite/src/data/index.ts'
// })
// await generator.generateAll()
