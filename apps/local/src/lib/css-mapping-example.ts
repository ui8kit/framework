/**
 * Example usage of UI8Kit CSS mapping utilities
 */

import { classToCss, classesToCss, hasCssMapping, generateStyleAttribute } from './ui8kit-css-utils';

// Example 1: Single class (your border-r-0 question)
const borderCss = classToCss('border-r-0');
console.log('border-r-0:', borderCss);
// Output: "border-right-width: 0px;"

// Example 2: Multiple classes
const combinedCss = classesToCss('border-r-0 text-center p-4');
console.log('Combined classes:', combinedCss);
// Output: "border-right-width: 0px; text-align: center; padding: 1rem;"

// Example 3: Check if mapping exists
const hasBorderMapping = hasCssMapping('border-r-0');
console.log('border-r-0 has mapping:', hasBorderMapping);
// Output: true

// Example 4: Generate HTML style attribute
const styleAttr = generateStyleAttribute('border-r-0 text-center bg-primary');
console.log('HTML style attribute:', styleAttr);
// Output: "border-right-width: 0px; text-align: center; background-color: hsl(var(--primary));"

// Example 5: For static HTML generation
function generateStyledDiv(classString: string, content: string): string {
  const css = generateStyleAttribute(classString);
  return `<div${css ? ` style="${css}"` : ''}>${content}</div>`;
}

const html = generateStyledDiv('border-r-0 text-center p-4', 'Hello World');
console.log('Generated HTML:', html);
// Output: <div style="border-right-width: 0px; text-align: center; padding: 1rem;">Hello World</div>

// Example 6: Working with complex classes
const complexClasses = 'truncate overflow-auto text-center justify-center';
const complexCss = classesToCss(complexClasses);
console.log('Complex CSS:', complexCss);
// Output: "overflow: hidden; text-overflow: ellipsis; white-space: nowrap; overflow: auto; text-align: center; justify-content: center;"
