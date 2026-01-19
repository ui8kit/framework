import { readFile } from 'node:fs/promises'
import { basename } from 'node:path'
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
   * Components to inject into MDX scope
   */
  components: Record<string, React.ComponentType>
  
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
  const { filePath, docsDir, basePath, components, tocConfig, htmlMode } = options
  
  // Read source
  const source = await readFile(filePath, 'utf-8')
  
  // Parse frontmatter
  const { frontmatter, content } = parseFrontmatter(source)
  
  // Extract TOC
  const toc = extractToc(content, tocConfig)
  
  // Calculate URL path
  const relativePath = filePath.replace(docsDir, '').replace(/^[\/\\]/, '')
  const urlPath = filePathToUrlPath(relativePath, basePath)
  
  // Compile MDX to JavaScript
  const compiled = await compile(content, {
    outputFormat: 'function-body',
    development: false,
  })
  
  // Run compiled MDX
  const { default: MdxContent } = await run(compiled, {
    ...runtime,
    baseUrl: import.meta.url,
  })
  
  // Create component with injected components
  const WrappedContent = () => {
    return React.createElement(MdxContent, { components })
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

