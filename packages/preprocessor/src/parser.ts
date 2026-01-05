import { readFile, readdir } from 'fs/promises';
import { join, extname } from 'path';

export interface ComponentStyle {
  /** CSS selector from data-class */
  selector: string;
  /** Utility props to convert to CSS classes */
  props: Record<string, any>;
  /** Source file path for debugging */
  sourceFile: string;
  /** Line number in source file */
  lineNumber: number;
}

export interface ParserOptions {
  verbose?: boolean;
}

/**
 * Parse all components in source directory and extract styles
 */
export async function parseComponents(srcDir: string, options: ParserOptions = {}): Promise<ComponentStyle[]> {
  const { verbose = false } = options;
  const components: ComponentStyle[] = [];

  // Find all TypeScript/React files
  const files = await findSourceFiles(srcDir);

  for (const file of files) {
    try {
      const fileComponents = await parseFile(file, options);
      components.push(...fileComponents);
    } catch (error) {
      if (verbose) {
        console.warn(`⚠️ Failed to parse ${file}:`, error);
      }
    }
  }

  return components;
}

/**
 * Recursively find all TypeScript/React files
 */
async function findSourceFiles(dir: string): Promise<string[]> {
  const files: string[] = [];

  const entries = await readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip node_modules and dist
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules' && entry.name !== 'dist') {
        files.push(...await findSourceFiles(fullPath));
      }
    } else if (entry.isFile() && isSourceFile(entry.name)) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Check if file is a TypeScript/React source file
 */
function isSourceFile(filename: string): boolean {
  const ext = extname(filename);
  return ['.ts', '.tsx', '.jsx', '.js'].includes(ext);
}

/**
 * Parse a single source file and extract component styles using regex
 */
async function parseFile(filePath: string, options: ParserOptions): Promise<ComponentStyle[]> {
  const { verbose = false } = options;
  const content = await readFile(filePath, 'utf-8');
  const components: ComponentStyle[] = [];

  // Regex to find JSX elements with data-class attribute
  // Matches: <Component data-class="value" prop="value" ...>
  const jsxRegex = /<[\w\.]+\s+[^>]*data-class\s*=\s*["']([^"']+)["'][^>]*>/g;

  let match;
  let lineNumber = 1;

  // Split content into lines for line number tracking
  const lines = content.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineStartPos = content.indexOf(line, lineNumber > 1 ? content.lastIndexOf('\n', content.indexOf(line) - 1) + 1 : 0);

    // Reset regex for each line
    jsxRegex.lastIndex = 0;

    while ((match = jsxRegex.exec(line)) !== null) {
      const fullMatch = match[0];
      const dataClassValue = match[1];

      // Extract props from the matched JSX element
      const props = extractPropsFromJSX(fullMatch);

      if (Object.keys(props).length > 0) {
        components.push({
          selector: dataClassValue,
          props,
          sourceFile: filePath,
          lineNumber: i + 1
        });
      }
    }
  }

  if (verbose && components.length > 0) {
    console.log(`📄 ${filePath}: found ${components.length} styled elements`);
  }

  return components;
}

/**
 * Extract props from JSX element string
 */
function extractPropsFromJSX(jsxString: string): Record<string, any> {
  const props: Record<string, any> = {};

  // Match all attribute="value" or attribute='value' or attribute={value}
  const attrRegex = /(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)'|\{([^}]*)\})/g;

  let match;
  while ((match = attrRegex.exec(jsxString)) !== null) {
    const [, attrName, doubleQuoteValue, singleQuoteValue, braceValue] = match;

    let value: any = null;

    if (doubleQuoteValue !== undefined) {
      value = doubleQuoteValue;
    } else if (singleQuoteValue !== undefined) {
      value = singleQuoteValue;
    } else if (braceValue !== undefined) {
      // For now, only handle simple string expressions in braces
      const trimmed = braceValue.trim();
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        value = trimmed.slice(1, -1);
      } else if (trimmed === 'true') {
        value = true;
      } else if (trimmed === 'false') {
        value = false;
      } else {
        // Skip complex expressions for now
        continue;
      }
    }

    if (value !== null) {
      props[attrName] = value;
    }
  }

  return props;
}
