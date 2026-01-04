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
 * Analyze route file to find which components are used and their dependencies
 */
async function analyzeRouteComponents(routeFile: string, options: CriticalCSSOptions): Promise<Set<string>> {
  const { verbose = false } = options;
  const content = await readFile(routeFile, 'utf-8');

  const usedComponents = new Set<string>();

  // Find direct component usage in JSX
  const componentRegex = /<([A-Z][\w]*)/g;
  let match;

  while ((match = componentRegex.exec(content)) !== null) {
    const componentName = match[1];
    usedComponents.add(componentName);

    // Add component dependencies (layout components, etc.)
    const dependencies = getComponentDependencies(componentName);
    dependencies.forEach(dep => usedComponents.add(dep));
  }

  // Analyze imports to find more components
  const importRegex = /import\s+{([^}]*)}\s+from\s+['"]([^'"]*)['"]/g;
  while ((match = importRegex.exec(content)) !== null) {
    const importedItems = match[1];
    const importPath = match[2];

    if (importPath.includes('blocks') || importPath.includes('layouts')) {
      // Parse imported block/layout components
      const items = importedItems.split(',').map(item => item.trim());
      items.forEach(item => {
        if (item) usedComponents.add(item);
      });
    }
  }

  if (verbose) {
    console.log(`📄 Found components in ${routeFile}:`, Array.from(usedComponents));
  }

  return usedComponents;
}

/**
 * Get component dependencies (which components this component uses)
 */
function getComponentDependencies(componentName: string): string[] {
  const dependencies: Record<string, string[]> = {
    // Layout components and their dependencies
    'DashLayout': ['Sidebar', 'Navbar', 'Block', 'Box', 'Container', 'Button', 'Icon', 'Text', 'Group', 'Stack'],
    'Sidebar': ['Block', 'Box', 'Stack', 'Text'],
    'Navbar': ['Block', 'Group', 'Icon', 'Text', 'Button'],

    // Block components
    'HeroBlock': ['Block', 'Stack', 'Text', 'Group', 'Button'],
    'FeaturesBlock': ['Block', 'Stack', 'Text', 'Grid', 'Box'],
    'DashboardBlock': ['Block', 'Text', 'Grid', 'Box', 'Group'],

    // UI components
    'Button': ['button'],
    'Icon': ['span'],
    'Text': ['p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    'Box': ['div'],
    'Block': ['div', 'section', 'article', 'header', 'footer', 'nav', 'aside'],
    'Container': ['div'],
    'Group': ['div'],
    'Stack': ['div'],
    'Grid': ['div'],
  };

  return dependencies[componentName] || [];
}

/**
 * Filter components to only include those used in the route
 */
function filterRouteComponents(
  allComponents: ComponentStyle[],
  usedComponents: Set<string>
): ComponentStyle[] {
  // Map component names to their data-class selectors
  const componentSelectors = new Map<string, string[]>([
    ['Sidebar', ['sidebar']],
    ['Navbar', ['navbar', 'navbar-group', 'navbar-brand-group', 'navbar-toggle-dark-mode-button']],
    ['HeroBlock', ['hero-section', 'hero-content', 'hero-title', 'hero-description', 'hero-actions', 'hero-cta-primary', 'hero-cta-secondary']],
    ['FeaturesBlock', ['features-section', 'features-header', 'features-title', 'features-description', 'features-grid']],
    ['DashboardBlock', ['dashboard-section', 'dashboard-title', 'dashboard-grid', 'dashboard-description', 'dashboard-actions', 'dashboard-preview']],
    ['Block', ['block']],
    ['Box', ['box']],
    ['Container', ['container']],
    ['Button', ['button']],
    ['Icon', ['icon']],
    ['Text', ['text']],
    ['Group', ['group']],
    ['Stack', ['stack']],
  ]);

  const allowedSelectors = new Set<string>();

  // Add selectors for used components
  for (const componentName of usedComponents) {
    const selectors = componentSelectors.get(componentName);
    if (selectors) {
      selectors.forEach(selector => allowedSelectors.add(selector));
    }
  }

  // Filter components to only include allowed selectors
  return allComponents.filter(component =>
    allowedSelectors.has(component.selector.replace('.', ''))
  );
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
