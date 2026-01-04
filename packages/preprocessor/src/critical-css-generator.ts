import { readFile } from 'fs/promises';
import { ComponentStyle } from './parser.js';
import { parseComponents } from './parser.js';

interface CriticalCSSOptions {
  verbose?: boolean;
}

/**
 * Generate critical CSS for a specific route by analyzing only components used in that route
 */
export async function generateCriticalCSS(
  routeFile: string,
  srcDir: string,
  options: CriticalCSSOptions = {}
): Promise<string> {
  const { verbose = false } = options;

  // 1. Parse the route file to find used components
  const usedComponents = await analyzeRouteComponents(routeFile, { verbose });

  // 2. Parse all components to get their styles
  const allComponents = await parseComponents(srcDir, { verbose });

  // 3. Filter only components used in this route
  const routeComponents = filterRouteComponents(allComponents, usedComponents);

  // 4. Generate CSS from ui8kit.map.ts (like pure CSS generator)
  const criticalCss = await generateCriticalCSSFromComponents(routeComponents, { verbose });

  if (verbose) {
    console.log(`🔍 Route ${routeFile}: found ${usedComponents.size} component types`);
    console.log(`📦 Generated ${routeComponents.length} critical styles`);
  }

  return criticalCss;
}

/**
 * Analyze route file to find which components are used
 */
async function analyzeRouteComponents(routeFile: string, options: CriticalCSSOptions): Promise<Set<string>> {
  const { verbose = false } = options;
  const content = await readFile(routeFile, 'utf-8');

  const usedComponents = new Set<string>();

  // Simple regex to find component usage (improve this for more accuracy)
  const componentRegex = /<([A-Z][\w]*)/g;
  let match;

  while ((match = componentRegex.exec(content)) !== null) {
    const componentName = match[1];
    usedComponents.add(componentName);
  }

  // Also check imports to be more accurate
  const importRegex = /import\s+{[^}]*}?\s+from\s+['"]([^'"]*)['"]/g;
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.includes('components') || importPath.includes('ui')) {
      // Could parse the imported file for component names
      // For now, we'll use the basic approach
    }
  }

  if (verbose) {
    console.log(`📄 Found components in ${routeFile}:`, Array.from(usedComponents));
  }

  return usedComponents;
}

/**
 * Filter components to only include those used in the route
 */
function filterRouteComponents(
  allComponents: ComponentStyle[],
  usedComponents: Set<string>
): ComponentStyle[] {
  // For now, include all components since we need a more sophisticated analysis
  // In a real implementation, we'd track component usage through the tree
  return allComponents;
}

/**
 * Generate critical CSS from component styles using ui8kit.map.ts
 */
async function generateCriticalCSSFromComponents(
  components: ComponentStyle[],
  options: CriticalCSSOptions
): Promise<string> {
  const { verbose = false } = options;

  // Load ui8kit map
  const ui8kitMapPath = './apps/local/src/lib/ui8kit.map.ts';
  const ui8kitMapContent = await readFile(ui8kitMapPath, 'utf-8');
  const ui8kitMap = parseUi8kitMap(ui8kitMapContent);

  // Convert components to CSS
  const cssRules: string[] = [];
  const processedSelectors = new Set<string>();

  for (const component of components) {
    if (processedSelectors.has(component.selector)) continue;
    processedSelectors.add(component.selector);

    const cssProperties = convertPropsToCSS(component.props, ui8kitMap);

    if (cssProperties.length > 0) {
      cssRules.push(`.${component.selector} {\n${cssProperties.map(p => `  ${p}`).join('\n')}\n}`);
    }
  }

  const criticalCss = cssRules.join('\n\n');

  if (verbose) {
    console.log(`🎯 Generated ${cssRules.length} critical CSS rules`);
  }

  return criticalCss;
}

/**
 * Parse ui8kit.map.ts content into a usable map
 */
function parseUi8kitMap(content: string): Map<string, string> {
  const map = new Map<string, string>();

  const match = content.match(/export const ui8kitMap = \{([\s\S]*?)\};/);
  if (!match) {
    throw new Error('Could not parse ui8kit.map.ts');
  }

  const objectContent = match[1];
  const propertyRegex = /"([^"]+)":\s*"([^"]+)",?/g;
  let propertyMatch;

  while ((propertyMatch = propertyRegex.exec(objectContent)) !== null) {
    const [, className, cssProperty] = propertyMatch;
    map.set(className, cssProperty);
  }

  return map;
}

/**
 * Convert component props to CSS properties
 */
function convertPropsToCSS(props: Record<string, any>, ui8kitMap: Map<string, string>): string[] {
  const properties: string[] = [];

  for (const [key, value] of Object.entries(props)) {
    if (key === 'data-class') continue;

    if (value === true || value === '') {
      const css = ui8kitMap.get(key);
      if (css) properties.push(css);
    } else if (typeof value === 'string') {
      const className = `${key}-${value}`;
      const css = ui8kitMap.get(className);
      if (css) properties.push(css);
    }
  }

  return properties;
}
