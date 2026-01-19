import { readdir, readFile, writeFile, mkdir } from 'node:fs/promises'
import { join, dirname, relative } from 'node:path'
import type { 
  MdxGeneratorConfig, 
  GeneratedMdxPage,
} from '../core/types'
import { compileMdxFile } from './mdx-compiler'
import { emitLiquidPage, generateDocsLayoutTemplate, generateDocsNavTemplate } from './liquid-emitter'
import { generateDocsNavigation } from './nav-generator'
import { generatePropsData } from './props-extractor'
import { scanDocsTree } from '../core/scanner'

// ============================================================================
// MDX Documentation Generator
// ============================================================================

export interface GenerateDocsOptions {
  /**
   * MDX configuration from generator.config.ts
   */
  config: MdxGeneratorConfig
  
  /**
   * Base directory (where generator.config.ts is)
   */
  baseDir: string
  
  /**
   * HTML output mode
   */
  htmlMode: 'tailwind' | 'semantic' | 'inline'
  
  /**
   * Verbose logging
   */
  verbose?: boolean
}

/**
 * Generate documentation from MDX files
 * 
 * Called from @ui8kit/generator when mdx.enabled is true
 */
export async function generateDocsFromMdx(
  options: GenerateDocsOptions
): Promise<GeneratedMdxPage[]> {
  const { config, baseDir, htmlMode, verbose } = options
  
  console.log('📚 Generating MDX documentation...')
  
  const docsDir = join(baseDir, config.docsDir)
  const outputDir = join(baseDir, config.outputDir)
  const demosDir = config.demosDir ? join(baseDir, config.demosDir) : join(outputDir, '../partials/demos')
  const basePath = config.basePath || '/docs'
  
  // 1. Scan docs directory
  if (verbose) console.log(`  Scanning ${config.docsDir}...`)
  const docsTree = await scanDocsTree(docsDir, { basePath })
  const mdxFiles = await collectMdxFiles(docsDir)
  
  if (verbose) console.log(`  Found ${mdxFiles.length} MDX files`)
  
  // 2. Load components for MDX scope
  const components = await loadComponents(config.components || {}, baseDir)
  
  // 3. Extract props from TypeScript (if configured)
  if (config.propsSource) {
    const propsDir = join(baseDir, config.propsSource)
    const propsOutput = join(baseDir, 'dist/props-data.json')
    
    if (verbose) console.log(`  Extracting props from ${config.propsSource}...`)
    await generatePropsData(propsDir, propsOutput)
  }
  
  // 4. Compile each MDX file
  const results: GeneratedMdxPage[] = []
  
  for (const filePath of mdxFiles) {
    try {
      const result = await compileMdxFile({
        filePath,
        docsDir,
        basePath,
        components,
        tocConfig: config.toc,
        htmlMode,
      })
      
      // Emit Liquid template
      await emitLiquidPage(result, {
        pagesDir: outputDir,
        demosDir,
        basePath,
      })
      
      results.push(result)
    } catch (error) {
      console.error(`  ✗ Failed to compile ${relative(docsDir, filePath)}:`, error)
    }
  }
  
  // 5. Generate navigation JSON
  if (config.navOutput) {
    const navPath = join(baseDir, config.navOutput)
    await generateDocsNavigation(docsTree, navPath)
  }
  
  // 6. Generate layout templates (optional)
  await generateTemplates(baseDir, config)
  
  console.log(`✅ Generated ${results.length} documentation pages`)
  
  return results
}

/**
 * Collect all MDX files from directory recursively
 */
async function collectMdxFiles(dir: string): Promise<string[]> {
  const files: string[] = []
  
  const entries = await readdir(dir, { withFileTypes: true })
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name)
    
    if (entry.isDirectory()) {
      files.push(...await collectMdxFiles(fullPath))
    } else if (entry.name.endsWith('.mdx') || entry.name.endsWith('.md')) {
      files.push(fullPath)
    }
  }
  
  return files
}

/**
 * Load components for MDX scope
 * In build mode, we create simple HTML stub components
 * (real components can't be imported in Node.js without bundling)
 */
async function loadComponents(
  componentMap: Record<string, string>,
  baseDir: string
): Promise<Record<string, React.ComponentType<any>>> {
  // Import React for createElement
  const React = await import('react')
  
  const components: Record<string, React.ComponentType<any>> = {}
  
  // Add built-in doc components
  const { ComponentPreview, PropsTable, Callout, Steps } = await import('../components')
  components.ComponentPreview = ComponentPreview as any
  components.PropsTable = PropsTable as any
  components.Callout = Callout as any
  components.Steps = Steps as any
  
  // Create stub components for user components
  // These render basic HTML with data-class for semantic generation
  for (const [name, _importPath] of Object.entries(componentMap)) {
    components[name] = createStubComponent(name, React)
  }
  
  return components
}

/**
 * Create a simple stub component that renders HTML
 * Used for static generation when real components can't be loaded
 */
function createStubComponent(
  name: string, 
  React: typeof import('react')
): React.ComponentType<any> {
  const dataClass = name.toLowerCase()
  
  // Return a functional component that renders semantic HTML
  return function StubComponent(props: any) {
    const { children, variant, size, className, ...rest } = props
    
    // Build class names from props
    const classes = [dataClass]
    if (variant) classes.push(`${dataClass}-${variant}`)
    if (size) classes.push(`${dataClass}-${size}`)
    if (className) classes.push(className)
    
    // Map component names to HTML elements
    const tagMap: Record<string, string> = {
      Button: 'button',
      Card: 'div',
      Badge: 'span',
      Text: 'p',
      Title: 'h2',
      Stack: 'div',
      Box: 'div',
      Grid: 'div',
      Container: 'div',
      Group: 'div',
      Icon: 'span',
      Image: 'img',
    }
    
    const tag = tagMap[name] || 'div'
    
    // For img elements, handle src differently
    if (tag === 'img') {
      return React.createElement(tag, {
        ...rest,
        className: classes.join(' '),
        'data-class': classes.join(' '),
        alt: rest.alt || name,
      })
    }
    
    return React.createElement(tag, {
      ...rest,
      className: classes.join(' '),
      'data-class': classes.join(' '),
    }, children)
  }
}

/**
 * Generate docs layout templates
 */
async function generateTemplates(
  baseDir: string,
  config: MdxGeneratorConfig
): Promise<void> {
  const viewsDir = dirname(join(baseDir, config.outputDir))
  const layoutsDir = join(viewsDir, 'layouts')
  const partialsDir = join(viewsDir, 'partials')
  
  // Create directories
  await mkdir(layoutsDir, { recursive: true })
  await mkdir(partialsDir, { recursive: true })
  
  // Check if layout already exists (don't overwrite)
  const layoutPath = join(layoutsDir, 'docs.liquid')
  try {
    await readFile(layoutPath)
  } catch {
    // Create layout template
    await writeFile(layoutPath, generateDocsLayoutTemplate(), 'utf-8')
    console.log(`  → ${layoutPath}`)
  }
  
  // Create nav partial template
  const navPath = join(partialsDir, 'docs-nav.liquid')
  try {
    await readFile(navPath)
  } catch {
    await writeFile(navPath, generateDocsNavTemplate(), 'utf-8')
    console.log(`  → ${navPath}`)
  }
}

// Re-export types and utilities
export { compileMdxFile } from './mdx-compiler'
export { emitLiquidPage } from './liquid-emitter'
export { generateDocsNavigation, docsTreeToNav, sortNavItems } from './nav-generator'
export { extractPropsFromFile, extractPropsFromDirectory, generatePropsData } from './props-extractor'
