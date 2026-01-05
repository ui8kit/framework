/**
 * HtmlToCss - Generate CSS from static HTML files
 *
 * This script scans generated HTML files and creates:
 * - tailwind.apply.css: @apply directives for Tailwind projects
 * - ui8kit.local.css: Pure CSS3 properties using ui8kit.map.ts
 *
 * Process:
 * 1. Scan HTML files in output directory
 * 2. Extract class="" and data-class="" attributes
 * 3. Group classes by semantic selectors (data-class)
 * 4. Generate @apply CSS and pure CSS3 versions
 */

import { writeFileSync, mkdirSync, existsSync, readdirSync, readFileSync } from 'fs'
import { join, dirname } from 'path'

type HtmlToCssConfig = {
  /** Directory containing HTML files */
  htmlDir: string
  /** Path to ui8kit.map.ts */
  ui8kitMapPath: string
  /** Output file for @apply directives */
  applyCssFile: string
  /** Output file for pure CSS3 */
  pureCssFile: string
}

type ElementData = {
  /** CSS selector (from data-class or generated) */
  selector: string
  /** Array of CSS classes used */
  classes: string[]
  /** Source HTML file */
  sourceFile: string
}

class HtmlToCss {
  private config: HtmlToCssConfig | null = null

  /**
   * Configure the CSS generator
   */
  configure(config: HtmlToCssConfig): HtmlToCss {
    this.config = config
    return this
  }

  /**
   * Get ui8kit map path from config (defaults to JSON)
   */
  private getUi8kitMapPath(): string {
    return this.config?.ui8kitMapPath || './lib/ui8kit.map.json'
  }

  /**
   * Generate CSS files from HTML
   */
  async generateAll(): Promise<void> {
    if (!this.config) {
      throw new Error('Configuration is required. Call configure() first.')
    }

    const { htmlDir, ui8kitMapPath, applyCssFile, pureCssFile } = this.config

    console.log(`🔍 Scanning HTML files in: ${htmlDir}`)

    // 1. Scan all HTML files and extract element data
    const elements = await this.scanHtmlFiles(htmlDir)
    console.log(`📄 Found ${elements.length} styled elements across ${this.getUniqueFiles(elements).length} files`)

    // 2. Group elements by selectors and handle conflicts
    const groupedElements = this.groupBySelectors(elements)
    console.log(`🎯 Generated ${groupedElements.size} unique selectors`)

    // 3. Load ui8kit map for pure CSS generation
    const mapPath = this.getUi8kitMapPath()
    const ui8kitMap = await this.loadUi8kitMap(mapPath)
    console.log(`📚 Loaded ${ui8kitMap.size} CSS mappings from ${mapPath}`)

    // 4. Generate @apply CSS (Tailwind compatible)
    const applyCss = this.generateApplyCss(groupedElements)
    this.writeCssFile(applyCssFile, applyCss)
    console.log(`✅ Generated ${applyCssFile} (${applyCss.length} bytes)`)

    // 5. Generate pure CSS3
    const pureCss = this.generatePureCss(groupedElements, ui8kitMap)
    this.writeCssFile(pureCssFile, pureCss)
    console.log(`✅ Generated ${pureCssFile} (${pureCss.length} bytes)`)

    console.log('🎉 CSS generation completed!')
  }

  /**
   * Recursively scan HTML files and extract element data
   */
  private async scanHtmlFiles(dir: string): Promise<ElementData[]> {
    const elements: ElementData[] = []
    const files = this.getHtmlFiles(dir)

    for (const file of files) {
      const fileElements = this.extractElementsFromHtml(file)
      elements.push(...fileElements)
    }

    return elements
  }

  /**
   * Get all HTML files recursively
   */
  private getHtmlFiles(dir: string): string[] {
    const files: string[] = []

    function scan(currentDir: string) {
      const entries = readdirSync(currentDir, { withFileTypes: true })

      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name)

        if (entry.isDirectory()) {
          scan(fullPath) // Recursive scan
        } else if (entry.isFile() && entry.name.endsWith('.html')) {
          files.push(fullPath)
        }
      }
    }

    scan(dir)
    return files
  }

  /**
   * Extract elements with classes from HTML file
   */
  private extractElementsFromHtml(filePath: string): ElementData[] {
    const html = readFileSync(filePath, 'utf-8')
    const elements: ElementData[] = []

    // Simple approach: split HTML into tags and parse each one
    const tagRegex = /<[^>]+>/g
    let match

    while ((match = tagRegex.exec(html)) !== null) {
      const tagContent = match[0]

      // Extract attributes using a more robust parser
      const classes = this.extractClassAttribute(tagContent)
      const dataClass = this.extractDataClassAttribute(tagContent)
      const tagName = this.extractTagName(tagContent)

      if (classes.length > 0) {
        elements.push({
          selector: dataClass || this.generateSelector(tagName),
          classes,
          sourceFile: filePath
        })
      }
    }

    return elements
  }

  /**
   * Extract class attribute value from tag
   */
  private extractClassAttribute(tagContent: string): string[] {
    // Use a more precise regex that distinguishes between different attribute types
    // Match: space + attributeName="value" or space + attributeName='value'
    const attrRegex = /\s+(\w+(?:-\w+)*)\s*=\s*["']([^"']*)["']/g
    let match
    let classValue = ''

    while ((match = attrRegex.exec(tagContent)) !== null) {
      const [, attrName, attrValue] = match

      // Only capture the class attribute (not data-class)
      if (attrName === 'class') {
        classValue = attrValue
        break // Take the first class attribute found
      }
    }

    if (classValue) {
      const classes = classValue.split(/\s+/).filter(cls => cls.trim() && !cls.includes('data-'))
      return classes
    }

    return []
  }

  /**
   * Extract data-class attribute value from tag
   */
  private extractDataClassAttribute(tagContent: string): string {
    const dataClassMatch = tagContent.match(/data-class\s*=\s*["']([^"']*)["']/)
    return dataClassMatch ? dataClassMatch[1].trim() : ''
  }

  /**
   * Extract tag name from tag
   */
  private extractTagName(tagContent: string): string {
    const tagMatch = tagContent.match(/^<([a-zA-Z][a-zA-Z0-9]*)/)
    return tagMatch ? tagMatch[1] : 'div'
  }

  /**
   * Generate selector for elements without data-class
   */
  private generateSelector(tagName: string): string {
    // Generate random suffix: 7 characters (letters and numbers)
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let suffix = ''
    for (let i = 0; i < 7; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return `${tagName}-${suffix}`
  }

  /**
   * Group elements by unique class combinations, eliminating duplicates
   * Each unique set of classes gets assigned to the first encountered selector
   */
  private groupBySelectors(elements: ElementData[]): Map<string, string[]> {
    const selectorMap = new Map<string, string[]>()
    const classSetToSelector = new Map<string, string>()

    for (const element of elements) {
      const classes = element.classes
      const normalizedClasses = this.normalizeClasses(classes)
      const classKey = normalizedClasses.join(' ')

      // If we've already seen this exact set of classes, skip it
      if (classSetToSelector.has(classKey)) {
        continue // This class combination is already assigned to a selector
      }

      // Assign this class combination to the current selector
      classSetToSelector.set(classKey, element.selector)
      selectorMap.set(element.selector, classes)
    }

    return selectorMap
  }

  /**
   * Normalize classes by sorting them alphabetically
   * This ensures that ['a', 'b'] and ['b', 'a'] are treated as identical
   */
  private normalizeClasses(classes: string[]): string[] {
    return [...classes].sort()
  }


  /**
   * Load ui8kit.map.json directly
   */
  private async loadUi8kitMap(mapPath: string): Promise<Map<string, string>> {
    try {
      // Try JSON first (preferred)
      const jsonPath = mapPath.replace(/\.ts$/, '.json')
      const jsonContent = readFileSync(jsonPath, 'utf-8')
      const ui8kitMapObject = JSON.parse(jsonContent)

      // Convert object to Map
      const ui8kitMap = new Map<string, string>()
      for (const [key, value] of Object.entries(ui8kitMapObject)) {
        ui8kitMap.set(key, value as string)
      }

      return ui8kitMap
    } catch (error) {
      // Fallback to TypeScript parsing if JSON fails
      return this.loadUi8kitMapFallback(mapPath)
    }
  }

  /**
   * Fallback method for TypeScript parsing (kept for compatibility)
   */
  private loadUi8kitMapFallback(mapPath: string): Map<string, string> {
    // Simplified fallback - just throw error since we prefer JSON
    throw new Error(`JSON import failed and TypeScript fallback is not available. Please ensure ${mapPath.replace('.ts', '.json')} exists.`)
  }

  /**
   * Generate @apply CSS (Tailwind compatible)
   */
  private generateApplyCss(selectorMap: Map<string, string[]>): string {
    const cssRules: string[] = []

    // Sort selectors for consistent output
    const sortedSelectors = Array.from(selectorMap.keys()).sort()

    for (const selector of sortedSelectors) {
      const classes = selectorMap.get(selector) || []
      if (classes.length > 0) {
        cssRules.push(`.${selector} {\n  @apply ${classes.join(' ')};\n}`)
      }
    }

    const header = `/*
 * Generated by HtmlToCss - @apply directives for Tailwind CSS
 * Do not edit manually - this file is auto-generated
 * Generated on: ${new Date().toISOString()}
 */\n\n`

    return header + cssRules.join('\n\n') + '\n'
  }

  /**
   * Generate pure CSS3 using ui8kit.map.ts
   */
  private generatePureCss(selectorMap: Map<string, string[]>, ui8kitMap: Map<string, string>): string {
    const cssRules: string[] = []

    // Sort selectors for consistent output
    const sortedSelectors = Array.from(selectorMap.keys()).sort()

    for (const selector of sortedSelectors) {
      const classes = selectorMap.get(selector) || []
      const cssProperties: string[] = []

      for (const className of classes) {
        const cssProperty = ui8kitMap.get(className)
        if (cssProperty) {
          cssProperties.push(`  ${cssProperty}`)
        } else {
          cssProperties.push(`  /* Unknown class: ${className} */`)
        }
      }

      if (cssProperties.length > 0) {
        cssRules.push(`.${selector} {\n${cssProperties.join('\n')}\n}`)
      }
    }

    const header = `/*
 * Generated by HtmlToCss - Pure CSS3 properties
 * Do not edit manually - this file is auto-generated
 * Generated on: ${new Date().toISOString()}
 */\n\n`

    return header + cssRules.join('\n\n') + '\n'
  }

  /**
   * Write CSS file with directory creation
   */
  private writeCssFile(filePath: string, content: string): void {
    const dir = dirname(filePath)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    writeFileSync(filePath, content, 'utf-8')
  }

  /**
   * Get count of unique source files
   */
  private getUniqueFiles(elements: ElementData[]): number {
    return new Set(elements.map(el => el.sourceFile)).size
  }
}

// Export singleton instance with fluent API
export const htmlToCss = new HtmlToCss()

// Export class for custom instances
export { HtmlToCss }
