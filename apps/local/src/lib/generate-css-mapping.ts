/**
 * Generate Complete UI8Kit Tailwind-to-CSS Mapping
 * Uses resolveUtilityClassName to generate all classes and their CSS mappings
 */

import { utilityPropsMap } from './utility-props.map';
import { resolveUtilityClassName } from './utility-props';

// Generate all possible prop combinations
function generateAllPropCombinations() {
  const combinations: Record<string, any>[] = [];

  for (const [prefix, values] of Object.entries(utilityPropsMap)) {
    for (const value of values) {
      const props: Record<string, any> = {};
      if (value === '') {
        props[prefix] = true; // bare token like "flex", "block"
      } else {
        props[prefix] = value;
      }
      combinations.push(props);
    }
  }

  return combinations;
}

// Generate all classes using resolveUtilityClassName
function generateAllClasses(): string[] {
  const combinations = generateAllPropCombinations();
  const allClasses = new Set<string>();

  for (const props of combinations) {
    const { utilityClassName } = resolveUtilityClassName(props);
    if (utilityClassName) {
      // Split multiple classes (space-separated)
      const classes = utilityClassName.split(' ').filter(c => c.trim());
      classes.forEach(cls => allClasses.add(cls));
    }
  }

  return Array.from(allClasses).sort();
}

// Generate CSS mapping for a class
function getCssForClass(className: string): string {
  // Layout & Display
  if (className === 'absolute') return 'position: absolute;';
  if (className === 'relative') return 'position: relative;';
  if (className === 'fixed') return 'position: fixed;';
  if (className === 'static') return 'position: static;';
  if (className === 'sticky') return 'position: sticky;';

  if (className === 'block') return 'display: block;';
  if (className === 'inline') return 'display: inline;';
  if (className === 'inline-block') return 'display: inline-block;';
  if (className === 'flex') return 'display: flex;';
  if (className === 'inline-flex') return 'display: inline-flex;';
  if (className === 'grid') return 'display: grid;';
  if (className === 'inline-grid') return 'display: inline-grid;';
  if (className === 'hidden') return 'display: none;';

  // Flexbox
  if (className === 'flex-1') return 'flex: 1 1 0%;';
  if (className === 'flex-auto') return 'flex: 1 1 auto;';
  if (className === 'flex-initial') return 'flex: 0 1 auto;';
  if (className === 'flex-none') return 'flex: none;';

  // Flex basis
  const basisValues: Record<string, string> = {
    'basis-0': 'flex-basis: 0;',
    'basis-auto': 'flex-basis: auto;',
    'basis-full': 'flex-basis: 100%;',
    'basis-px': 'flex-basis: 1px;',
  };
  if (basisValues[className]) return basisValues[className];

  if (className === 'flex-row') return 'flex-direction: row;';
  if (className === 'flex-row-reverse') return 'flex-direction: row-reverse;';
  if (className === 'flex-col') return 'flex-direction: column;';
  if (className === 'flex-col-reverse') return 'flex-direction: column-reverse;';

  if (className === 'flex-nowrap') return 'flex-wrap: nowrap;';
  if (className === 'flex-wrap') return 'flex-wrap: wrap;';
  if (className === 'flex-wrap-reverse') return 'flex-wrap: wrap-reverse;';

  if (className === 'justify-start') return 'justify-content: flex-start;';
  if (className === 'justify-end') return 'justify-content: flex-end;';
  if (className === 'justify-center') return 'justify-content: center;';
  if (className === 'justify-between') return 'justify-content: space-between;';
  if (className === 'justify-around') return 'justify-content: space-around;';
  if (className === 'justify-evenly') return 'justify-content: space-evenly;';

  if (className === 'items-start') return 'align-items: flex-start;';
  if (className === 'items-end') return 'align-items: flex-end;';
  if (className === 'items-center') return 'align-items: center;';
  if (className === 'items-baseline') return 'align-items: baseline;';
  if (className === 'items-stretch') return 'align-items: stretch;';

  // Spacing (convert to rem)
  function spacingValue(num: number): string {
    return `${num * 0.25}rem`;
  }

  const spacingMatch = className.match(/^(m|mt|mr|mb|ml|p|pt|pr|pb|pl|px|py|mx|my|gap|gap-x|gap-y)-(\d+)$/);
  if (spacingMatch) {
    const [, prop, value] = spacingMatch;
    const numValue = parseInt(value);
    const remValue = spacingValue(numValue);

    if (prop === 'm') return `margin: ${remValue};`;
    if (prop === 'mt') return `margin-top: ${remValue};`;
    if (prop === 'mr') return `margin-right: ${remValue};`;
    if (prop === 'mb') return `margin-bottom: ${remValue};`;
    if (prop === 'ml') return `margin-left: ${remValue};`;
    if (prop === 'mx') return `margin-left: ${remValue}; margin-right: ${remValue};`;
    if (prop === 'my') return `margin-top: ${remValue}; margin-bottom: ${remValue};`;

    if (prop === 'p') return `padding: ${remValue};`;
    if (prop === 'pt') return `padding-top: ${remValue};`;
    if (prop === 'pr') return `padding-right: ${remValue};`;
    if (prop === 'pb') return `padding-bottom: ${remValue};`;
    if (prop === 'pl') return `padding-left: ${remValue};`;
    if (prop === 'px') return `padding-left: ${remValue}; padding-right: ${remValue};`;
    if (prop === 'py') return `padding-top: ${remValue}; padding-bottom: ${remValue};`;

    if (prop === 'gap') return `gap: ${remValue};`;
    if (prop === 'gap-x') return `column-gap: ${remValue};`;
    if (prop === 'gap-y') return `row-gap: ${remValue};`;
  }

  // Special spacing
  const specialSpacing: Record<string, string> = {
    'm-auto': 'margin: auto;',
    'mt-auto': 'margin-top: auto;',
    'mr-auto': 'margin-right: auto;',
    'mb-auto': 'margin-bottom: auto;',
    'ml-auto': 'margin-left: auto;',
    'mx-auto': 'margin-left: auto; margin-right: auto;',
    'my-auto': 'margin-top: auto; margin-bottom: auto;',
  };
  if (specialSpacing[className]) return specialSpacing[className];

  // Grid
  const gridColsMatch = className.match(/^grid-cols-(\d+)$/);
  if (gridColsMatch) {
    const cols = gridColsMatch[1];
    return `grid-template-columns: repeat(${cols}, minmax(0, 1fr));`;
  }

  const gridRowsMatch = className.match(/^grid-rows-(\d+)$/);
  if (gridRowsMatch) {
    const rows = gridRowsMatch[1];
    return `grid-template-rows: repeat(${rows}, minmax(0, 1fr));`;
  }

  // Grid flow (auto placement)
  const gridFlowMap: Record<string, string> = {
    'grid-flow-row': 'grid-auto-flow: row;',
    'grid-flow-col': 'grid-auto-flow: column;',
    'grid-flow-row-dense': 'grid-auto-flow: row dense;',
    'grid-flow-col-dense': 'grid-auto-flow: column dense;',
    'grid-flow-dense': 'grid-auto-flow: dense;',
  };
  if (gridFlowMap[className]) return gridFlowMap[className];

  const colSpanMatch = className.match(/^col-span-(\d+)$/);
  if (colSpanMatch) {
    const span = colSpanMatch[1];
    return `grid-column: span ${span} / span ${span};`;
  }

  const colStartMatch = className.match(/^col-start-(\d+)$/);
  if (colStartMatch) {
    const start = colStartMatch[1];
    return `grid-column-start: ${start};`;
  }

  const colEndMatch = className.match(/^col-end-(\d+)$/);
  if (colEndMatch) {
    const end = colEndMatch[1];
    return `grid-column-end: ${end};`;
  }

  // Special grid cases
  if (className === 'col-span-full') return 'grid-column: 1 / -1;';
  if (className === 'col-start-auto') return 'grid-column-start: auto;';
  if (className === 'col-end-auto') return 'grid-column-end: auto;';

  // Row positioning (equivalent to column positioning)
  const rowSpanMatch = className.match(/^row-span-(\d+)$/);
  if (rowSpanMatch) {
    const span = rowSpanMatch[1];
    return `grid-row: span ${span} / span ${span};`;
  }

  const rowStartMatch = className.match(/^row-start-(\d+)$/);
  if (rowStartMatch) {
    const start = rowStartMatch[1];
    return `grid-row-start: ${start};`;
  }

  const rowEndMatch = className.match(/^row-end-(\d+)$/);
  if (rowEndMatch) {
    const end = rowEndMatch[1];
    return `grid-row-end: ${end};`;
  }

  // Special row cases
  if (className === 'row-start-auto') return 'grid-row-start: auto;';
  if (className === 'row-end-auto') return 'grid-row-end: auto;';

  // Grid auto sizing
  const autoColsMap: Record<string, string> = {
    'auto-cols-auto': 'grid-auto-columns: auto;',
    'auto-cols-min': 'grid-auto-columns: min-content;',
    'auto-cols-max': 'grid-auto-columns: max-content;',
    'auto-cols-fr': 'grid-auto-columns: minmax(0, 1fr);',
  };
  if (autoColsMap[className]) return autoColsMap[className];

  const autoRowsMap: Record<string, string> = {
    'auto-rows-auto': 'grid-auto-rows: auto;',
    'auto-rows-min': 'grid-auto-rows: min-content;',
    'auto-rows-max': 'grid-auto-rows: max-content;',
    'auto-rows-fr': 'grid-auto-rows: minmax(0, 1fr);',
  };
  if (autoRowsMap[className]) return autoRowsMap[className];

  // Colors (CSS custom properties)
  const colorMap: Record<string, string> = {
    'bg-primary': 'background-color: hsl(var(--primary));',
    'bg-secondary': 'background-color: hsl(var(--secondary));',
    'bg-accent': 'background-color: hsl(var(--accent));',
    'bg-destructive': 'background-color: hsl(var(--destructive));',
    'bg-muted': 'background-color: hsl(var(--muted));',
    'bg-card': 'background-color: hsl(var(--card));',
    'bg-popover': 'background-color: hsl(var(--popover));',
    'bg-background': 'background-color: hsl(var(--background));',
    'bg-transparent': 'background-color: transparent;',
    'bg-border': 'background-color: hsl(var(--border));',
    'bg-input': 'background-color: hsl(var(--input));',
    'bg-ring': 'background-color: hsl(var(--ring));',
    'bg-primary-foreground': 'background-color: hsl(var(--primary-foreground));',
    'bg-secondary-foreground': 'background-color: hsl(var(--secondary-foreground));',
    'bg-destructive-foreground': 'background-color: hsl(var(--destructive-foreground));',
    'bg-muted-foreground': 'background-color: hsl(var(--muted-foreground));',
    'bg-accent-foreground': 'background-color: hsl(var(--accent-foreground));',
    'bg-foreground': 'background-color: hsl(var(--foreground));',

    'text-primary': 'color: hsl(var(--primary));',
    'text-secondary': 'color: hsl(var(--secondary));',
    'text-accent': 'color: hsl(var(--accent));',
    'text-destructive': 'color: hsl(var(--destructive));',
    'text-muted-foreground': 'color: hsl(var(--muted-foreground));',
    'text-foreground': 'color: hsl(var(--foreground));',
    'text-primary-foreground': 'color: hsl(var(--primary-foreground));',
    'text-secondary-foreground': 'color: hsl(var(--secondary-foreground));',
    'text-destructive-foreground': 'color: hsl(var(--destructive-foreground));',
    'text-accent-foreground': 'color: hsl(var(--accent-foreground));',
  };
  if (colorMap[className]) return colorMap[className];

  // Caret colors
  const caretMap: Record<string, string> = {
    'caret-accent': 'caret-color: hsl(var(--accent));',
    'caret-current': 'caret-color: currentColor;',
    'caret-foreground': 'caret-color: hsl(var(--foreground));',
    'caret-primary': 'caret-color: hsl(var(--primary));',
    'caret-secondary': 'caret-color: hsl(var(--secondary));',
    'caret-transparent': 'caret-color: transparent;',
  };
  if (caretMap[className]) return caretMap[className];

  // Accent colors
  const accentMap: Record<string, string> = {
    'accent-auto': 'accent-color: auto;',
    'accent-current': 'accent-color: currentColor;',
    'accent-inherit': 'accent-color: inherit;',
  };
  if (accentMap[className]) return accentMap[className];

  // Text sizes
  const textSizes: Record<string, string> = {
    'text-xs': 'font-size: 0.75rem; line-height: 1rem;',
    'text-sm': 'font-size: 0.875rem; line-height: 1.25rem;',
    'text-base': 'font-size: 1rem; line-height: 1.5rem;',
    'text-lg': 'font-size: 1.125rem; line-height: 1.75rem;',
    'text-xl': 'font-size: 1.25rem; line-height: 1.75rem;',
    'text-2xl': 'font-size: 1.5rem; line-height: 2rem;',
    'text-3xl': 'font-size: 1.875rem; line-height: 2.25rem;',
    'text-4xl': 'font-size: 2.25rem; line-height: 2.5rem;',
    'text-5xl': 'font-size: 3rem; line-height: 1;',
  };
  if (textSizes[className]) return textSizes[className];

  // Text alignment
  if (className === 'text-left') return 'text-align: left;';
  if (className === 'text-center') return 'text-align: center;';
  if (className === 'text-right') return 'text-align: right;';
  if (className === 'text-justify') return 'text-align: justify;';

  // Text transform
  const textTransforms: Record<string, string> = {
    'uppercase': 'text-transform: uppercase;',
    'lowercase': 'text-transform: lowercase;',
    'capitalize': 'text-transform: capitalize;',
    'normal-case': 'text-transform: none;',
  };
  if (textTransforms[className]) return textTransforms[className];

  // Font weights
  const fontWeights: Record<string, string> = {
    'font-thin': 'font-weight: 100;',
    'font-light': 'font-weight: 300;',
    'font-normal': 'font-weight: 400;',
    'font-medium': 'font-weight: 500;',
    'font-semibold': 'font-weight: 600;',
    'font-bold': 'font-weight: 700;',
    'font-extrabold': 'font-weight: 800;',
    'font-black': 'font-weight: 900;',
  };
  if (fontWeights[className]) return fontWeights[className];

  // Font style
  if (className === 'italic') return 'font-style: italic;';
  if (className === 'not-italic') return 'font-style: normal;';

  // Line heights
  const lineHeights: Record<string, string> = {
    'leading-none': 'line-height: 1;',
    'leading-tight': 'line-height: 1.25;',
    'leading-snug': 'line-height: 1.375;',
    'leading-normal': 'line-height: 1.5;',
    'leading-relaxed': 'line-height: 1.625;',
    'leading-loose': 'line-height: 2;',
  };
  if (lineHeights[className]) return lineHeights[className];

  // Text decoration
  if (className === 'underline') return 'text-decoration-line: underline;';
  if (className === 'line-through') return 'text-decoration-line: line-through;';
  if (className === 'no-underline') return 'text-decoration-line: none;';

  // Borders
  if (className === 'border') return 'border-width: 1px;';
  if (className === 'border-0') return 'border-width: 0;';
  if (className === 'border-2') return 'border-width: 2px;';
  if (className === 'border-4') return 'border-width: 4px;';
  if (className === 'border-8') return 'border-width: 8px;';

  // Border styles and colors
  const borderStyles: Record<string, string> = {
    'border-solid': 'border-style: solid;',
    'border-dashed': 'border-style: dashed;',
    'border-dotted': 'border-style: dotted;',
    'border-current': 'border-color: currentColor;',
    'border-transparent': 'border-color: transparent;',
    'border-accent': 'border-color: hsl(var(--accent));',
    'border-primary': 'border-color: hsl(var(--primary));',
    'border-secondary': 'border-color: hsl(var(--secondary));',
    'border-muted': 'border-color: hsl(var(--muted));',
    'border-destructive': 'border-color: hsl(var(--destructive));',
    'border-foreground': 'border-color: hsl(var(--foreground));',
    'border-input': 'border-color: hsl(var(--input));',
    'border-border': 'border-color: hsl(var(--border));',
    'border-ring': 'border-color: hsl(var(--ring));',
  };
  if (borderStyles[className]) return borderStyles[className];

  // Border sides (your border-r-0 example)
  const borderSidesMatch = className.match(/^border-(t|r|b|l)-(\d+)$/);
  if (borderSidesMatch) {
    const [, side, width] = borderSidesMatch;
    const sideMap = {
      't': 'top',
      'r': 'right',
      'b': 'bottom',
      'l': 'left'
    };
    return `border-${sideMap[side]}-width: ${width}px;`;
  }

  // Border sides (bare)
  const borderSideBareMatch = className.match(/^border-(t|r|b|l)$/);
  if (borderSideBareMatch) {
    const [, side] = borderSideBareMatch;
    const sideMap = {
      't': 'top',
      'r': 'right',
      'b': 'bottom',
      'l': 'left'
    };
    return `border-${sideMap[side]}-width: 1px;`;
  }

  // Border radius
  const borderRadius: Record<string, string> = {
    'rounded': 'border-radius: 0.25rem;',
    'rounded-none': 'border-radius: 0;',
    'rounded-sm': 'border-radius: 0.125rem;',
    'rounded-md': 'border-radius: 0.375rem;',
    'rounded-lg': 'border-radius: 0.5rem;',
    'rounded-xl': 'border-radius: 0.75rem;',
    'rounded-2xl': 'border-radius: 1rem;',
    'rounded-3xl': 'border-radius: 1.5rem;',
    'rounded-full': 'border-radius: 9999px;',
  };
  if (borderRadius[className]) return borderRadius[className];

  // Border radius directional (rounded-t, rounded-r, etc.)
  const borderRadiusDirectionalMatch = className.match(/^rounded-(t|r|b|l)(-full|-lg|-md|-sm|-xl|-2xl|-3xl|-none)?$/);
  if (borderRadiusDirectionalMatch) {
    const [, direction, size = ''] = borderRadiusDirectionalMatch;
    const radiusMap: Record<string, string> = {
      '': '0.25rem',
      '-none': '0',
      '-sm': '0.125rem',
      '-md': '0.375rem',
      '-lg': '0.5rem',
      '-xl': '0.75rem',
      '-2xl': '1rem',
      '-3xl': '1.5rem',
      '-full': '9999px'
    };

    const radius = radiusMap[size];
    const directionMap = {
      't': ['top-left', 'top-right'],
      'r': ['top-right', 'bottom-right'],
      'b': ['bottom-right', 'bottom-left'],
      'l': ['top-left', 'bottom-left']
    };

    const sides = directionMap[direction];
    return `border-${sides[0]}-radius: ${radius}; border-${sides[1]}-radius: ${radius};`;
  }

  // Box shadows
  const shadows: Record<string, string> = {
    'shadow-none': 'box-shadow: 0 0 #0000;',
    'shadow-sm': 'box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);',
    'shadow-md': 'box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);',
    'shadow-lg': 'box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);',
    'shadow-xl': 'box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);',
    'shadow-2xl': 'box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.25);',
    'shadow-inner': 'box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 0.05);',
  };
  if (shadows[className]) return shadows[className];

  // Overflow (your examples)
  const overflows: Record<string, string> = {
    'overflow-auto': 'overflow: auto;',
    'overflow-hidden': 'overflow: hidden;',
    'overflow-visible': 'overflow: visible;',
    'overflow-scroll': 'overflow: scroll;',
    'overflow-x-auto': 'overflow-x: auto;',
    'overflow-x-hidden': 'overflow-x: hidden;',
    'overflow-x-visible': 'overflow-x: visible;',
    'overflow-x-scroll': 'overflow-x: scroll;',
    'overflow-y-auto': 'overflow-y: auto;',
    'overflow-y-hidden': 'overflow-y: hidden;',
    'overflow-y-visible': 'overflow-y: visible;',
    'overflow-y-scroll': 'overflow-y: scroll;',
  };
  if (overflows[className]) return overflows[className];

  // Text overflow (your truncate example)
  if (className === 'truncate') return 'overflow: hidden; text-overflow: ellipsis; white-space: nowrap;';

  // Aspect Ratio
  const aspectRatios: Record<string, string> = {
    'aspect-auto': 'aspect-ratio: auto;',
    'aspect-square': 'aspect-ratio: 1 / 1;',
    'aspect-video': 'aspect-ratio: 16 / 9;',
  };
  if (aspectRatios[className]) return aspectRatios[className];

  // Width & Height
  const sizing: Record<string, string> = {
    'w-auto': 'width: auto;',
    'w-full': 'width: 100%;',
    'w-screen': 'width: 100vw;',
    'w-min': 'width: min-content;',
    'w-max': 'width: max-content;',
    'w-fit': 'width: fit-content;',
    'h-auto': 'height: auto;',
    'h-full': 'height: 100%;',
    'h-screen': 'height: 100vh;',
    'h-min': 'height: min-content;',
    'h-max': 'height: max-content;',
    'h-fit': 'height: fit-content;',
  };
  if (sizing[className]) return sizing[className];

  // Visibility
  if (className === 'visible') return 'visibility: visible;';
  if (className === 'invisible') return 'visibility: hidden;';

  // Positioning (top, right, bottom, left, inset)
  const positionProps: Record<string, string> = {
    'top-0': 'top: 0;',
    'top-auto': 'top: auto;',
    'right-0': 'right: 0;',
    'right-auto': 'right: auto;',
    'bottom-0': 'bottom: 0;',
    'bottom-auto': 'bottom: auto;',
    'left-0': 'left: 0;',
    'left-auto': 'left: auto;',
    'inset-0': 'top: 0; right: 0; bottom: 0; left: 0;',
    'inset-auto': 'top: auto; right: auto; bottom: auto; left: auto;',
  };
  if (positionProps[className]) return positionProps[className];

  // Z-index
  const zIndexMatch = className.match(/^z-(\d+|auto)$/);
  if (zIndexMatch) {
    const value = zIndexMatch[1];
    return `z-index: ${value};`;
  }

  // Opacity
  const opacityMatch = className.match(/^opacity-(\d+)$/);
  if (opacityMatch) {
    const value = parseInt(opacityMatch[1]) / 100;
    return `opacity: ${value};`;
  }

  // Default fallback
  return `/* ${className} - CSS mapping needed */`;
}

// Generate complete mapping
function generateCompleteMapping(): Record<string, string> {
  const classes = generateAllClasses();
  const mapping: Record<string, string> = {};

  for (const className of classes) {
    mapping[className] = getCssForClass(className);
  }

  return mapping;
}

// Main execution - save the complete mapping
if (import.meta.main) {
  const completeMapping = generateCompleteMapping();

  // Save to file
  const fs = require('fs');
  fs.writeFileSync('ui8kit-css-mapping.json', JSON.stringify(completeMapping, null, 2));

  console.log(`Generated complete CSS mapping for ${Object.keys(completeMapping).length} classes`);
  console.log('Saved to ui8kit-css-mapping.json');

  // Test your specific examples
  console.log('\nYour examples:');
  console.log('truncate:', completeMapping['truncate']);
  console.log('overflow-auto:', completeMapping['overflow-auto']);
  console.log('overflow-scroll:', completeMapping['overflow-scroll']);
  console.log('overflow-y-auto:', completeMapping['overflow-y-auto']);
  console.log('text-center:', completeMapping['text-center']);
  console.log('justify-center:', completeMapping['justify-center']);
}

export { generateAllClasses, generateCompleteMapping, getCssForClass };
