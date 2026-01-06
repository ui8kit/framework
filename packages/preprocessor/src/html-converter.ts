import { readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';

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

    // Extract elements from HTML
    const html = await readFile(htmlFilePath, 'utf-8');
    const elements = this.extractElementsFromHtml(html, htmlFilePath);

    if (verbose) {
      console.log(`📄 Found ${elements.length} elements with classes`);
    }

    // Group by selectors
    const groupedElements = this.groupBySelectors(elements);

    // Generate CSS
    const applyCss = this.generateApplyCss(groupedElements);
    const pureCss = this.generatePureCss(groupedElements);

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
          classes,
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
   * Generate @apply CSS
   */
  private generateApplyCss(selectorMap: Map<string, string[]>): string {
    const cssRules: string[] = [];
    const sortedSelectors = Array.from(selectorMap.keys()).sort();

    for (const selector of sortedSelectors) {
      const classes = selectorMap.get(selector) || [];
      if (classes.length > 0) {
        cssRules.push(`.${selector} {\n  @apply ${classes.join(' ')};\n}`);
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
   * Generate pure CSS3
   */
  private generatePureCss(selectorMap: Map<string, string[]>): string {
    const cssRules: string[] = [];
    const sortedSelectors = Array.from(selectorMap.keys()).sort();

    for (const selector of sortedSelectors) {
      const classes = selectorMap.get(selector) || [];
      const cssProperties: string[] = [];

      for (const className of classes) {
        const cssProperty = this.ui8kitMap?.get(className);
        if (cssProperty) {
          cssProperties.push(`  ${cssProperty}`);
        } else {
          cssProperties.push(`  /* Unknown class: ${className} */`);
        }
      }

      if (cssProperties.length > 0) {
        cssRules.push(`.${selector} {\n${cssProperties.join('\n')}\n}`);
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
