/**
 * Example usage of UI8Kit CSS mapping system for Grid classes
 */

import { classToCss, classesToCss, generateStyleAttribute } from './ui8kit-css-utils';

// Example 1: Grid columns and rows (your question)
const gridColsCss = classToCss('grid-cols-4');
console.log('grid-cols-4:', gridColsCss);
// Result: "grid-template-columns: repeat(4, minmax(0, 1fr));"

const gridRowsCss = classToCss('grid-rows-4');
console.log('grid-rows-4:', gridRowsCss);
// Result: "grid-template-rows: repeat(4, minmax(0, 1fr));"

// Example 2: Grid flow
const gridFlowCss = classToCss('grid-flow-row-dense');
console.log('grid-flow-row-dense:', gridFlowCss);
// Result: "grid-auto-flow: row dense;"

// Example 3: Column and row positioning
const colSpanCss = classToCss('col-span-3');
console.log('col-span-3:', colSpanCss);
// Result: "grid-column: span 3 / span 3;"

const rowStartCss = classToCss('row-start-2');
console.log('row-start-2:', rowStartCss);
// Result: "grid-row-start: 2;"

// Example 4: Auto sizing
const autoColsCss = classToCss('auto-cols-fr');
console.log('auto-cols-fr:', autoColsCss);
// Result: "grid-auto-columns: minmax(0, 1fr);"

const autoRowsCss = classToCss('auto-rows-auto');
console.log('auto-rows-auto:', autoRowsCss);
// Result: "grid-auto-rows: auto;"

// Example 5: Complex grid layout
const complexGridCss = classesToCss('grid-cols-3 grid-rows-2 gap-4');
console.log('Complex grid:', complexGridCss);
// Result: "grid-template-columns: repeat(3, minmax(0, 1fr)); grid-template-rows: repeat(2, minmax(0, 1fr)); gap: 1rem;"

// Example 6: Grid item positioning
const gridItemCss = classesToCss('col-span-2 row-start-1 col-end-4');
console.log('Grid item positioning:', gridItemCss);
// Result: "grid-column: span 2 / span 2; grid-row-start: 1; grid-column-end: 4;"

// Example 7: HTML generation
function generateGridHTML() {
  const containerCss = generateStyleAttribute('grid grid-cols-3 grid-rows-2 gap-4');
  const item1Css = generateStyleAttribute('col-span-2 bg-primary');
  const item2Css = generateStyleAttribute('col-start-3 bg-secondary');

  return `
    <div style="${containerCss}">
      <div style="${item1Css}">Item 1 (spans 2 columns)</div>
      <div style="${item2Css}">Item 2 (starts col 3)</div>
      <div>Item 3</div>
      <div>Item 4</div>
      <div>Item 5</div>
    </div>
  `;
}

console.log('Generated HTML:');
console.log(generateGridHTML());
