import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// Import htmlToCss functionality
// Note: We'll copy the core logic here to avoid circular dependencies
// In a real implementation, we might extract htmlToCss into a shared package

interface HtmlConverterOptions {
  verbose?: boolean;
}

/**
 * Convert HTML snapshots to CSS using the same logic as htmlToCss.ts
 */
export class HtmlConverter {
  private ui8kitMap: Map<string, string> | null = null;
  private shadcnMap: Map<string, string> | null = null;

  /**
   * Convert HTML file to CSS files
   */
  async convertHtmlToCss(
    htmlFilePath: string,
    outputApplyCss: string,
    outputPureCss: string,
    options: HtmlConverterOptions = {}
  ): Promise<{ applyCss: string; pureCss: string }> {
    const { verbose = false } = options;

    if (verbose) {
      console.log(`🔄 Converting HTML to CSS: ${htmlFilePath}`);
    }

    // Load ui8kit map
    await this.loadUi8kitMap(htmlFilePath);

    // Load shadcn map
    await this.loadShadcnMap(htmlFilePath);

    // Extract elements from HTML
    const html = await readFile(htmlFilePath, 'utf-8');
    const elements = this.extractElementsFromHtml(html, htmlFilePath);

    if (verbose) {
      console.log(`📄 Found ${elements.length} elements with classes`);
    }

    // Group by selectors
    const groupedElements = this.groupBySelectors(elements);

    // Merge duplicate class sets (e.g., feature-card-0, feature-card-1 with same classes)
    const mergedSelectors = this.mergeDuplicateClassSets(groupedElements);

    // Generate CSS
    const applyCss = this.generateApplyCss(mergedSelectors);
    const pureCss = this.generatePureCss(mergedSelectors);

    return { applyCss, pureCss };
  }

  /**
   * Load ui8kit map for CSS property lookups
   */
  private async loadUi8kitMap(htmlFilePath: string): Promise<void> {
    // Find ui8kit.map.json - try multiple locations relative to project root
    const projectRoot = process.cwd();
    const possiblePaths = [
      join(projectRoot, '../../../apps/local/src/lib/ui8kit.map.json'), // from packages/generator/dist
      join(projectRoot, '../../apps/local/src/lib/ui8kit.map.json'),    // from packages/preprocessor/dist
      join(projectRoot, '../apps/local/src/lib/ui8kit.map.json'),      // from apps/local
      'apps/local/src/lib/ui8kit.map.json'                            // absolute from project root
    ];

    let jsonContent: string | null = null;
    let foundPath: string | null = null;

    for (const mapPath of possiblePaths) {
      try {
        jsonContent = await readFile(mapPath, 'utf-8');
        foundPath = mapPath;
        break;
      } catch {
        // Try next path
      }
    }

    if (!jsonContent || !foundPath) {
      throw new Error(`Could not find ui8kit.map.json. Tried: ${possiblePaths.join(', ')}`);
    }

    try {
      const ui8kitMapObject = JSON.parse(jsonContent);

      this.ui8kitMap = new Map<string, string>();
      for (const [key, value] of Object.entries(ui8kitMapObject)) {
        this.ui8kitMap.set(key, value as string);
      }
    } catch (error) {
      throw new Error(`Failed to parse ui8kit.map.json from ${foundPath}: ${error}`);
    }
  }

  /**
   * Load shadcn map for CSS property lookups
   */
  private async loadShadcnMap(htmlFilePath: string): Promise<void> {
    // Find shadcn.map.json relative to this file's location
    const pkgDir = dirname(fileURLToPath(import.meta.url));
    const shadcnMapPath = join(pkgDir, '../src/lib/shadcn.map.json');

    try {
      const jsonContent = await readFile(shadcnMapPath, 'utf-8');
      const shadcnMapObject = JSON.parse(jsonContent);

      this.shadcnMap = new Map<string, string>();
      for (const [key, value] of Object.entries(shadcnMapObject)) {
        this.shadcnMap.set(key, value as string);
      }
    } catch (error) {
      console.warn(`Failed to load shadcn.map.json from ${shadcnMapPath}: ${error}. Using empty map.`);
      this.shadcnMap = new Map<string, string>();
    }
  }

  /**
   * Extract elements with classes from HTML
   */
  private extractElementsFromHtml(html: string, sourceFile: string): ElementData[] {
    const elements: ElementData[] = [];

    // Simple regex to find tags with class or data-class attributes
    const tagRegex = /<[^>]+>/g;
    let match;

    while ((match = tagRegex.exec(html)) !== null) {
      const tagContent = match[0];

      const classes = this.extractClassAttribute(tagContent);
      const dataClass = this.extractDataClassAttribute(tagContent);

      if (classes.length > 0 || dataClass) {
        elements.push({
          selector: dataClass || this.generateSelector(tagContent),
          classes: classes.filter(cls => !cls.includes('data-class')), // Remove any data-class from classes
          sourceFile
        });
      }
    }

    return elements;
  }

  /**
   * Extract class attribute values (not data-class)
   */
  private extractClassAttribute(tagContent: string): string[] {
    // Use a more precise regex that finds class= but not data-class=
    const classRegex = /\s+class\s*=\s*["']([^"']*)["']/;
    const classMatch = tagContent.match(classRegex);
    if (!classMatch) return [];

    const classValue = classMatch[1];
    const classes = classValue.split(/\s+/).filter(cls => cls.trim());
    return classes;
  }

  /**
   * Extract data-class attribute value
   */
  private extractDataClassAttribute(tagContent: string): string {
    const dataClassMatch = tagContent.match(/data-class\s*=\s*["']([^"']*)["']/);
    return dataClassMatch ? dataClassMatch[1].trim() : '';
  }

  /**
   * Generate selector for elements without data-class
   */
  private generateSelector(tagContent: string): string {
    const tagMatch = tagContent.match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
    const tagName = tagMatch ? tagMatch[1] : 'div';

    // Generate random suffix
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let suffix = '';
    for (let i = 0; i < 7; i++) {
      suffix += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `${tagName}-${suffix}`;
  }

  /**
   * Group elements by data-class selectors and collect all their classes
   */
  private groupBySelectors(elements: ElementData[]): Map<string, string[]> {
    const selectorMap = new Map<string, string[]>();

    for (const element of elements) {
      const selector = element.selector;
      const classes = element.classes;

      // Skip elements without classes
      if (classes.length === 0) continue;

      // Add classes to existing selector or create new one
      const existingClasses = selectorMap.get(selector) || [];
      const allClasses = [...existingClasses, ...classes];

      // Remove duplicates
      const uniqueClasses = [...new Set(allClasses)];
      selectorMap.set(selector, uniqueClasses);
    }

    return selectorMap;
  }

  /**
   * Normalize classes by sorting
   */
  private normalizeClasses(classes: string[]): string[] {
    return [...classes].sort();
  }

  /**
   * Merge selectors with identical class sets to reduce CSS duplication
   * Example: feature-card-0, feature-card-1, feature-card-2 with same classes
   * → .feature-card-0, .feature-card-1, .feature-card-2 { @apply ... }
   */
  private mergeDuplicateClassSets(
    selectorMap: Map<string, string[]>
  ): Map<string, string[]> {
    // Create reverse mapping: normalized class set → list of selectors
    const classSetToSelectors = new Map<string, string[]>();

    for (const [selector, classes] of selectorMap.entries()) {
      // Normalize classes: sort and join to create a unique key
      const normalizedClasses = this.normalizeClasses(classes);
      const classSetKey = normalizedClasses.join(' ');

      // Group selectors by their class sets
      const existingSelectors = classSetToSelectors.get(classSetKey) || [];
      existingSelectors.push(selector);
      classSetToSelectors.set(classSetKey, existingSelectors);
    }

    // Create merged map: combined selector → classes
    const mergedMap = new Map<string, string[]>();

    for (const [classSetKey, selectors] of classSetToSelectors.entries()) {
      const classes = classSetKey.split(' ');

      if (selectors.length > 1) {
        // Multiple selectors with same classes - combine them
        // Use comma-separated selector: .selector1, .selector2, .selector3
        const combinedSelector = selectors.sort().join(', ');
        mergedMap.set(combinedSelector, classes);
      } else {
        // Single selector - keep as is
        mergedMap.set(selectors[0], classes);
      }
    }

    return mergedMap;
  }

  /**
   * Generate @apply CSS
   */
  private generateApplyCss(selectorMap: Map<string, string[]>): string {
    const cssRules: string[] = [];
    const sortedSelectors = Array.from(selectorMap.keys()).sort();

    for (const selector of sortedSelectors) {
      const classes = selectorMap.get(selector) || [];
      // Filter only valid Tailwind classes for @apply
      const validClasses = classes.filter(cls => this.isValidTailwindClass(cls));
      if (validClasses.length > 0) {
        // Handle combined selectors (comma-separated) vs single selectors
        if (selector.includes(', ')) {
          // Group selector: add . before each selector
          const selectors = selector.split(', ').map(s => `.${s.trim()}`).join(', ');
          cssRules.push(`${selectors} {\n  @apply ${validClasses.join(' ')};\n}`);
        } else {
          // Single selector
          cssRules.push(`.${selector} {\n  @apply ${validClasses.join(' ')};\n}`);
        }
      }
    }

    const header = `/*
 * Generated by UI8Kit CSS Preprocessor - @apply directives
 * Do not edit manually - this file is auto-generated
 * Generated on: ${new Date().toISOString()}
 */\n\n`;

    return header + cssRules.join('\n\n') + '\n';
  }

  /**
   * Check if class is a valid Tailwind class for @apply
   */
  private isValidTailwindClass(className: string): boolean {
    // Check if it's in ui8kit.map.json (known Tailwind classes)
    if (this.ui8kitMap?.has(className)) {
      return true;
    }

    // Check if it's in shadcn.map.json (known shadcn classes)
    if (this.shadcnMap?.has(className)) {
      return true;
    }

    console.warn(`Unknown class: ${className}`);
    return false;

    /* // Check for common Tailwind patterns (basic validation)
    const tailwindPatterns = [
      /^p[xylrtb]?-/,           // padding: px-, py-, pl-, pr-, pt-, pb-, p-
      /^m[xylrtb]?-/,           // margin: mx-, my-, ml-, mr-, mt-, mb-, m-
      /^gap-/,                  // gap-
      /^flex/,                  // flex, flex-*
      /^grid/,                  // grid, grid-*
      /^text-/,                 // text-*
      /^bg-/,                   // bg-*
      /^border/,                // border, border-*
      /^rounded/,               // rounded, rounded-*
      /^w-/,                    // w-*
      /^h-/,                    // h-*
      /^max-w-/,                // max-w-*
      /^min-w-/,                // min-w-*
      /^max-h-/,                // max-h-*
      /^min-h-/,                // min-h-*
      /^items-/,                // items-*
      /^justify-/,              // justify-*
      /^self-/,                 // self-*
      /^col-span-/,             // col-span-*
      /^row-span-/,             // row-span-*
      /^aspect-/,               // aspect-*
      /^relative$/,             // relative
      /^absolute$/,             // absolute
      /^block$/,                // block
      /^inline$/,               // inline
      /^inline-block$/,         // inline-block
      /^hidden$/,               // hidden
      /^visible$/,              // visible
      /^static$/,               // static
      /^fixed$/,                // fixed
      /^sticky$/,               // sticky
    ]; */

    // return tailwindPatterns.some(pattern => pattern.test(className));
    return true;
  }

  /**
   * Generate pure CSS3
   */
  private generatePureCss(selectorMap: Map<string, string[]>): string {
    const cssRules: string[] = [];
    const sortedSelectors = Array.from(selectorMap.keys()).sort();

    for (const selector of sortedSelectors) {
      const classes = selectorMap.get(selector) || [];
      const cssProperties: string[] = [];

      for (const className of classes) {
        let cssProperty: string | undefined;

        // First check ui8kit map
        cssProperty = this.ui8kitMap?.get(className);

        // If not found in ui8kit, check shadcn map
        if (!cssProperty) {
          cssProperty = this.shadcnMap?.get(className);
        }

        if (cssProperty) {
          cssProperties.push(`  ${cssProperty}`);
        } else {
          cssProperties.push(`  /* Unknown class: ${className} */`);
        }
      }

      if (cssProperties.length > 0) {
        // Handle combined selectors (comma-separated) vs single selectors
        if (selector.includes(', ')) {
          // Group selector: add . before each selector
          const selectors = selector.split(', ').map(s => `.${s.trim()}`).join(', ');
          cssRules.push(`${selectors} {\n${cssProperties.join('\n')}\n}`);
        } else {
          // Single selector
          cssRules.push(`.${selector} {\n${cssProperties.join('\n')}\n}`);
        }
      }
    }

    const header = `/*
 * Generated by UI8Kit CSS Preprocessor - Pure CSS3 properties
 * Do not edit manually - this file is auto-generated
 * Generated on: ${new Date().toISOString()}
 */\n\n`;

    return header + cssRules.join('\n\n') + '\n';
  }
}

interface ElementData {
  selector: string;
  classes: string[];
  sourceFile: string;
}

// Export singleton instance
export const htmlConverter = new HtmlConverter();
