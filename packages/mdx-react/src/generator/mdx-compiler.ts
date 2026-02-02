import { readFile } from 'node:fs/promises'
import { basename, resolve, dirname } from 'node:path'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import type { 
  Frontmatter, 
  TocEntry, 
  GeneratedMdxPage, 
  GeneratedDemo,
  TocConfig,
} from '../core/types'
import { parseFrontmatter, extractToc } from '../core/parser'

// ============================================================================
// MDX Compiler - Compiles MDX to React and renders to HTML
// ============================================================================

/**
 * Parsed import statement from MDX
 */
interface ParsedImport {
  /**
   * Named imports: { Button, Card }
   */
  names: string[]
  /**
   * Default import name
   */
  defaultImport?: string
  /**
   * Module path: '@ui8kit/core' or './components/Button'
   */
  modulePath: string
  /**
   * Original import statement
   */
  original: string
}

export interface CompileOptions {
  /**
   * MDX file path
   */
  filePath: string
  
  /**
   * Base docs directory
   */
  docsDir: string
  
  /**
   * Base URL path
   */
  basePath: string
  
  /**
   * Import path aliases for resolving imports.
   * @example { '@ui8kit/core': '../../packages/core/src/index' }
   */
  aliases?: Record<string, string>
  
  /**
   * @deprecated Use `aliases` instead
   */
  components?: Record<string, React.ComponentType>
  
  /**
   * TOC configuration
   */
  tocConfig?: TocConfig
  
  /**
   * HTML output mode
   */
  htmlMode: 'tailwind' | 'semantic' | 'inline'
}

/**
 * Compile a single MDX file to HTML
 */
export async function compileMdxFile(options: CompileOptions): Promise<GeneratedMdxPage> {
  const { filePath, docsDir, basePath, aliases = {}, components = {}, tocConfig, htmlMode } = options
  
  // Read source
  const source = await readFile(filePath, 'utf-8')
  
  // Parse frontmatter
  const { frontmatter, content } = parseFrontmatter(source)
  
  // Extract TOC
  const toc = extractToc(content, tocConfig)
  
  // Calculate URL path
  const relativePath = filePath.replace(docsDir, '').replace(/^[\/\\]/, '')
  const urlPath = filePathToUrlPath(relativePath, basePath)
  
  // Parse imports from MDX content
  const imports = parseImports(content)
  
  // Resolve imports to actual components using aliases
  const resolvedComponents = await resolveImports(imports, aliases, filePath)
  
  // Merge with legacy components prop (for backwards compatibility)
  const allComponents = { ...resolvedComponents, ...components }
  
  // Strip import statements from MDX content (components are now resolved)
  const contentWithoutImports = stripImports(content)
  
  // Compile MDX to JavaScript
  const compiled = await compile(contentWithoutImports, {
    outputFormat: 'function-body',
    development: false,
  })
  
  // Run compiled MDX with components available
  const { default: MdxContent } = await run(compiled, {
    ...runtime,
    baseUrl: import.meta.url,
  })
  
  // Create component with injected components
  const WrappedContent = () => {
    return React.createElement(MdxContent, { components: allComponents })
  }
  
  // Render to HTML
  let htmlContent = renderToStaticMarkup(React.createElement(WrappedContent))
  
  // Extract demos from ComponentPreview elements
  const demos = extractDemos(htmlContent, relativePath)
  
  // Process HTML based on mode
  htmlContent = processHtmlForMode(htmlContent, htmlMode)
  
  // Generate Liquid template
  const liquidContent = generateLiquidTemplate(htmlContent, frontmatter, toc, urlPath)
  
  return {
    urlPath,
    liquidContent,
    htmlContent,
    frontmatter,
    toc,
    demos,
  }
}

/**
 * Parse import statements from MDX content
 */
function parseImports(content: string): ParsedImport[] {
  const imports: ParsedImport[] = []
  
  // Match import statements
  // Patterns:
  //   import { Button, Card } from '@ui8kit/core'
  //   import Button from '@ui8kit/core'
  //   import { Button as Btn } from '@ui8kit/core'
  //   import * as UI from '@ui8kit/core'
  const importRegex = /^import\s+(?:(?:\{([^}]+)\})|(?:(\w+)))\s+from\s+['"]([^'"]+)['"]\s*;?\s*$/gm
  
  let match
  while ((match = importRegex.exec(content)) !== null) {
    const [original, namedImportsStr, defaultImport, modulePath] = match
    
    const names: string[] = []
    
    if (namedImportsStr) {
      // Parse named imports: { Button, Card as C, Badge }
      const namedMatches = namedImportsStr.split(',').map(s => s.trim())
      for (const named of namedMatches) {
        // Handle "Button as Btn" → use original name "Button"
        const asMatch = named.match(/^(\w+)(?:\s+as\s+\w+)?$/)
        if (asMatch) {
          names.push(asMatch[1])
        }
      }
    }
    
    imports.push({
      names,
      defaultImport: defaultImport || undefined,
      modulePath,
      original,
    })
  }
  
  return imports
}

/**
 * Resolve imports to actual React components using aliases
 */
async function resolveImports(
  imports: ParsedImport[],
  aliases: Record<string, string>,
  mdxFilePath: string
): Promise<Record<string, React.ComponentType>> {
  const resolved: Record<string, React.ComponentType> = {}
  const mdxDir = dirname(mdxFilePath)
  
  for (const imp of imports) {
    try {
      // Resolve module path using aliases
      const resolvedPath = resolveModulePath(imp.modulePath, aliases, mdxDir)
      
      if (!resolvedPath) {
        console.warn(`[mdx-compiler] Cannot resolve module: ${imp.modulePath}`)
        continue
      }
      
      // Dynamically import the module
      const module = await import(resolvedPath)
      
      // Handle default import
      if (imp.defaultImport) {
        const component = module.default || module[imp.defaultImport]
        if (component) {
          resolved[imp.defaultImport] = component
        }
      }
      
      // Handle named imports
      for (const name of imp.names) {
        if (module[name]) {
          resolved[name] = module[name]
        } else if (module.default?.[name]) {
          // Handle case where component is re-exported from default
          resolved[name] = module.default[name]
        } else {
          console.warn(`[mdx-compiler] Component "${name}" not found in ${imp.modulePath}`)
        }
      }
    } catch (error) {
      console.warn(`[mdx-compiler] Failed to import ${imp.modulePath}: ${error}`)
    }
  }
  
  return resolved
}

/**
 * Resolve module path using aliases
 */
function resolveModulePath(
  modulePath: string,
  aliases: Record<string, string>,
  mdxDir: string
): string | null {
  // Check for exact alias match first
  if (aliases[modulePath]) {
    const aliasValue = aliases[modulePath]
    // If alias is relative, resolve from cwd
    if (aliasValue.startsWith('.')) {
      return resolve(process.cwd(), aliasValue)
    }
    return aliasValue
  }
  
  // Check for prefix alias match (e.g., '@/' → './src/')
  for (const [alias, target] of Object.entries(aliases)) {
    if (modulePath.startsWith(alias + '/')) {
      const rest = modulePath.slice(alias.length + 1)
      const targetBase = target.startsWith('.') 
        ? resolve(process.cwd(), target)
        : target
      return resolve(targetBase, rest)
    }
  }
  
  // Handle relative imports
  if (modulePath.startsWith('.')) {
    return resolve(mdxDir, modulePath)
  }
  
  // For bare module specifiers (e.g., 'react'), return as-is
  // Node.js will try to resolve from node_modules
  return modulePath
}

/**
 * Strip import/export statements from MDX content
 * Components are resolved and injected via props instead
 */
function stripImports(content: string): string {
  // Remove import statements
  let result = content.replace(/^import\s+.*?from\s+['"][^'"]+['"];?\s*$/gm, '')
  
  // Remove export statements (but keep export default if any)
  result = result.replace(/^export\s+(?!default).*?;?\s*$/gm, '')
  
  return result.trim()
}

/**
 * Convert file path to URL path
 * docs/components/button.mdx → /docs/components/button
 */
function filePathToUrlPath(relativePath: string, basePath: string): string {
  let urlPath = relativePath
    .replace(/\.(mdx?|md)$/, '')
    .replace(/[\\]/g, '/')
  
  // Handle index files
  if (urlPath.endsWith('/index') || urlPath === 'index') {
    urlPath = urlPath.replace(/\/?index$/, '')
  }
  
  // Add base path
  const base = basePath.replace(/\/$/, '')
  return urlPath ? `${base}/${urlPath}` : base || '/'
}

/**
 * Extract demos from ComponentPreview elements in HTML
 */
function extractDemos(html: string, filePath: string): GeneratedDemo[] {
  const demos: GeneratedDemo[] = []
  const baseName = basename(filePath, '.mdx')
  
  // Match ComponentPreview divs
  const previewRegex = /<div[^>]*data-class="component-preview"[^>]*>([\s\S]*?)<\/div>(?=\s*<div[^>]*data-class="component-preview"|$)/g
  
  let match
  let index = 0
  while ((match = previewRegex.exec(html)) !== null) {
    const content = match[1]
    
    // Extract preview content
    const contentMatch = /<div[^>]*data-class="preview-content"[^>]*>([\s\S]*?)<\/div>/.exec(content)
    if (contentMatch) {
      const id = `${baseName}-${index}`
      demos.push({
        id,
        liquidContent: contentMatch[1].trim(),
        code: extractCodeFromPreview(content),
      })
      index++
    }
  }
  
  return demos
}

/**
 * Extract code block from preview HTML
 */
function extractCodeFromPreview(previewHtml: string): string {
  const codeMatch = /<code>([\s\S]*?)<\/code>/.exec(previewHtml)
  if (codeMatch) {
    return decodeHtmlEntities(codeMatch[1])
  }
  return ''
}

/**
 * Decode HTML entities
 */
function decodeHtmlEntities(html: string): string {
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

/**
 * Process HTML based on output mode
 */
function processHtmlForMode(
  html: string, 
  mode: 'tailwind' | 'semantic' | 'inline'
): string {
  if (mode === 'tailwind') {
    // Keep both class and data-class
    return html
  }
  
  if (mode === 'semantic') {
    // Remove class attributes, convert data-class to class
    html = html.replace(/\s+class\s*=\s*["'][^"']*["']/g, '')
    html = html.replace(/data-class=/g, 'class=')
    return html
  }
  
  // inline mode handled separately (CSS injection)
  return html
}

/**
 * Generate Liquid template from HTML content
 */
function generateLiquidTemplate(
  html: string,
  frontmatter: Frontmatter,
  toc: TocEntry[],
  urlPath: string
): string {
  const lines = [
    `{% comment %}`,
    `  Generated from MDX by @ui8kit/mdx-react`,
    `  URL: ${urlPath}`,
    `  DO NOT EDIT MANUALLY`,
    `{% endcomment %}`,
    ``,
    `{% assign page_title = "${frontmatter.title || ''}" %}`,
    `{% assign page_description = "${frontmatter.description || ''}" %}`,
    ``,
  ]
  
  // Add TOC as Liquid variable
  if (toc.length > 0) {
    lines.push(`{% assign page_toc = '${JSON.stringify(toc)}' | parse_json %}`)
    lines.push(``)
  }
  
  // Add content
  lines.push(html)
  
  return lines.join('\n')
}

