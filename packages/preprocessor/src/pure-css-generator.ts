import { readFile } from 'fs/promises';
import { dirname, join } from 'path';

interface PureCSSOptions {
  verbose?: boolean;
}

/**
 * Generate pure CSS3 from @apply CSS file by looking up properties in ui8kit.map.ts
 */
export async function generatePureCSS(applyCssFilePath: string, options: PureCSSOptions = {}): Promise<string> {
  const { verbose = false } = options;

  // Read the @apply CSS file
  const applyCss = await readFile(applyCssFilePath, 'utf-8');

  // Load ui8kit map (relative to the apply CSS file location)
  const ui8kitMapPath = join(dirname(applyCssFilePath), '../src/lib/ui8kit.map.ts');

  // For debugging - check if file exists
  try {
    await readFile(ui8kitMapPath, 'utf-8');
  } catch (error) {
    console.error(`Could not find ui8kit.map.ts at: ${ui8kitMapPath}`);
    throw error;
  }
  const ui8kitMapContent = await readFile(ui8kitMapPath, 'utf-8');

  // Parse ui8kit map
  const ui8kitMap = parseUi8kitMap(ui8kitMapContent);

  // Convert @apply CSS to pure CSS
  const pureCss = convertApplyToPureCSS(applyCss, ui8kitMap);

  if (verbose) {
    console.log(`🔄 Converted ${applyCss.split('\n').filter(line => line.includes('@apply')).length} @apply rules to pure CSS`);
  }

  return pureCss;
}

/**
 * Parse ui8kit.map.ts content into a usable map
 */
function parseUi8kitMap(content: string): Map<string, string> {
  const map = new Map<string, string>();

  // Extract the object content between "export const ui8kitMap = {" and "};"
  const match = content.match(/export const ui8kitMap = \{([\s\S]*?)\};/);
  if (!match) {
    throw new Error('Could not parse ui8kit.map.ts - invalid format');
  }

  const objectContent = match[1];

  // Parse key-value pairs like: "class-name": "css-property: value;",
  const propertyRegex = /"([^"]+)":\s*"([^"]+)",?/g;
  let propertyMatch;

  while ((propertyMatch = propertyRegex.exec(objectContent)) !== null) {
    const [, className, cssProperty] = propertyMatch;
    map.set(className, cssProperty);
  }

  return map;
}

/**
 * Convert @apply CSS to pure CSS by replacing class names with CSS properties
 */
function convertApplyToPureCSS(applyCss: string, ui8kitMap: Map<string, string>): string {
  const lines = applyCss.split('\n');
  const result: string[] = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Keep comments and empty lines as-is
    if (trimmed.startsWith('/*') || trimmed.startsWith('*') || trimmed === '' || trimmed === '*/') {
      result.push(line);
      continue;
    }

    // Process @apply rules
    if (trimmed.includes('@apply')) {
      const converted = convertApplyRule(trimmed, ui8kitMap);
      result.push(converted);
    } else {
      // Keep other CSS rules as-is (selectors, braces, etc.)
      result.push(line);
    }
  }

  return result.join('\n');
}

/**
 * Convert a single @apply rule to pure CSS properties
 */
function convertApplyRule(applyRule: string, ui8kitMap: Map<string, string>): string {
  // Extract the @apply part: @apply class1 class2 class3;
  const applyMatch = applyRule.match(/@apply\s+([^;]+);/);
  if (!applyMatch) {
    return applyRule; // Return as-is if no valid @apply found
  }

  const classList = applyMatch[1].trim();
  const classes = classList.split(/\s+/);

  // Convert each class to CSS property
  const cssProperties: string[] = [];

  for (const className of classes) {
    const cssProperty = ui8kitMap.get(className);
    if (cssProperty) {
      cssProperties.push(`  ${cssProperty}`);
    } else {
      // Keep unknown classes as comments for debugging
      cssProperties.push(`  /* Unknown class: ${className} */`);
    }
  }

  // Replace @apply with CSS properties
  if (cssProperties.length > 0) {
    return applyRule.replace(/@apply\s+[^;]+;/, cssProperties.join('\n'));
  }

  return applyRule;
}
