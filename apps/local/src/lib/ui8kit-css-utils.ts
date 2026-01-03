/**
 * UI8Kit CSS Utilities
 * Utilities for working with UI8Kit CSS mappings
 */

import cssMappingRaw from './ui8kit-css-mapping.json';

// Type for CSS mapping
export type CssMapping = Record<string, string>;

// Cast to typed mapping
const cssMapping = cssMappingRaw as CssMapping;

/**
 * Get CSS properties for a single UI8Kit class
 */
export function classToCss(className: string): string {
  const css = cssMapping[className];

  if (!css) {
    console.warn(`UI8Kit: No CSS mapping found for class "${className}"`);
    return '';
  }

  if (css.startsWith('/*') && css.includes('- CSS mapping needed */')) {
    console.warn(`UI8Kit: CSS mapping needed for class "${className}"`);
    return '';
  }

  return css;
}

/**
 * Convert multiple UI8Kit classes to combined CSS
 */
export function classesToCss(classString: string): string {
  const classes = classString.trim().split(/\s+/).filter(Boolean);
  const cssRules: string[] = [];

  for (const className of classes) {
    const css = classToCss(className);
    if (css) {
      cssRules.push(css);
    }
  }

  return cssRules.join(' ');
}

/**
 * Check if a class has CSS mapping
 */
export function hasCssMapping(className: string): boolean {
  const css = cssMapping[className];
  return css ? !css.startsWith('/*') && !css.includes('- CSS mapping needed */') : false;
}

/**
 * Get all classes that need CSS mapping
 */
export function getClassesNeedingMapping(): string[] {
  const needed: string[] = [];

  for (const [className, css] of Object.entries(cssMapping)) {
    if (css.startsWith('/*') && css.includes('- CSS mapping needed */')) {
      needed.push(className);
    }
  }

  return needed.sort();
}

/**
 * Generate CSS string from UI8Kit classes for inline styles
 */
export function generateInlineCss(classString: string): string {
  return classesToCss(classString);
}

/**
 * Generate CSS class for static HTML generation
 * Returns the CSS properties as a style attribute value
 */
export function generateStyleAttribute(classString: string): string {
  const css = classesToCss(classString);
  return css ? css : '';
}

// Example usage:
/*
// Single class
const css = classToCss('border-r-0'); // "border-right-width: 0;"

// Multiple classes
const combinedCss = classesToCss('border-r-0 text-center p-4');
// "border-right-width: 0; text-align: center; padding: 1rem;"

// Check if mapping exists
const hasMapping = hasCssMapping('border-r-0'); // true

// Get classes needing mapping
const missingMappings = getClassesNeedingMapping(); // ['border-r-0', 'border-r-2', ...]

// For HTML generation
const styleAttr = generateStyleAttribute('border-r-0 text-center');
// style="border-right-width: 0; text-align: center;"
*/
