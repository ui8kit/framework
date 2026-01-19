import { readFile, readdir } from 'node:fs/promises'
import { join, basename } from 'node:path'
import type { PropDefinition, ComponentPropsData } from '../core/types'

// ============================================================================
// Props Extractor - Extract component props from TypeScript sources
// ============================================================================

/**
 * Extract props from a TypeScript component file
 * Uses regex-based parsing (no TypeScript compiler dependency)
 */
export async function extractPropsFromFile(
  filePath: string
): Promise<ComponentPropsData | null> {
  const source = await readFile(filePath, 'utf-8')
  const componentName = basename(filePath, '.tsx').replace(/\..*$/, '')
  
  // Find interface definition: interface ButtonProps { ... }
  const interfaceMatch = findPropsInterface(source, componentName)
  
  if (!interfaceMatch) {
    return null
  }
  
  const props = parsePropsInterface(interfaceMatch)
  
  return {
    componentName,
    props,
    sourceFile: filePath,
  }
}

/**
 * Find props interface in source code
 */
function findPropsInterface(source: string, componentName: string): string | null {
  // Try common patterns:
  // 1. ComponentNameProps
  // 2. Props (if only one component in file)
  
  const patterns = [
    new RegExp(`interface\\s+${componentName}Props\\s*\\{([^}]+)\\}`, 's'),
    new RegExp(`type\\s+${componentName}Props\\s*=\\s*\\{([^}]+)\\}`, 's'),
    /interface\s+Props\s*\{([^}]+)\}/s,
  ]
  
  for (const pattern of patterns) {
    const match = pattern.exec(source)
    if (match) {
      return match[1]
    }
  }
  
  return null
}

/**
 * Parse props interface body to extract prop definitions
 */
function parsePropsInterface(interfaceBody: string): PropDefinition[] {
  const props: PropDefinition[] = []
  
  // Match prop lines: name?: type // comment or /** comment */
  const propRegex = /(?:\/\*\*\s*([\s\S]*?)\s*\*\/\s*)?(\w+)(\?)?:\s*([^;\/\n]+)/g
  
  let match
  while ((match = propRegex.exec(interfaceBody)) !== null) {
    const [, docComment, name, optional, type] = match
    
    // Skip common React props
    if (['children', 'className', 'style', 'ref'].includes(name)) {
      // Include children but mark specially
      if (name === 'children') {
        props.push({
          name: 'children',
          type: 'ReactNode',
          required: !optional,
          description: docComment?.trim() || 'Component content',
        })
      }
      continue
    }
    
    props.push({
      name,
      type: cleanType(type.trim()),
      required: !optional,
      description: docComment?.trim(),
      defaultValue: extractDefaultValue(name, type),
    })
  }
  
  return props
}

/**
 * Clean up type string for display
 */
function cleanType(type: string): string {
  return type
    .replace(/\s+/g, ' ')
    .replace(/React\./g, '')
    .trim()
}

/**
 * Try to extract default value from type
 */
function extractDefaultValue(name: string, type: string): string | undefined {
  // Common defaults based on prop names and types
  const commonDefaults: Record<string, string> = {
    variant: "'default'",
    size: "'default'",
    disabled: 'false',
    loading: 'false',
    open: 'false',
    checked: 'false',
  }
  
  return commonDefaults[name]
}

/**
 * Extract props from all components in a directory
 */
export async function extractPropsFromDirectory(
  dir: string
): Promise<Map<string, ComponentPropsData>> {
  const results = new Map<string, ComponentPropsData>()
  
  const entries = await readdir(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    if (entry.isDirectory()) {
      // Recursively scan subdirectories
      const subResults = await extractPropsFromDirectory(join(dir, entry.name))
      for (const [name, data] of subResults) {
        results.set(name, data)
      }
      continue
    }
    
    // Only process .tsx files
    if (!entry.name.endsWith('.tsx')) continue
    
    // Skip test files and index
    if (entry.name.includes('.test.') || entry.name === 'index.tsx') continue
    
    try {
      const filePath = join(dir, entry.name)
      const propsData = await extractPropsFromFile(filePath)
      
      if (propsData) {
        results.set(propsData.componentName, propsData)
      }
    } catch (error) {
      console.warn(`Failed to extract props from ${entry.name}:`, error)
    }
  }
  
  return results
}

/**
 * Generate props data JSON for build-time consumption
 */
export async function generatePropsData(
  componentsDir: string,
  outputPath: string
): Promise<void> {
  const propsMap = await extractPropsFromDirectory(componentsDir)
  
  const data: Record<string, ComponentPropsData> = {}
  for (const [name, props] of propsMap) {
    data[name] = props
  }
  
  const { writeFile, mkdir } = await import('node:fs/promises')
  const { dirname } = await import('node:path')
  
  await mkdir(dirname(outputPath), { recursive: true })
  await writeFile(outputPath, JSON.stringify(data, null, 2), 'utf-8')
  
  console.log(`  → ${outputPath} (${propsMap.size} components)`)
}
