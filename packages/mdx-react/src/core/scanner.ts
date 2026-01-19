import { readdir, readFile } from 'node:fs/promises'
import { join, relative, basename, dirname } from 'node:path'
import type { DocsTreeEntry, Frontmatter } from './types'
import { parseFrontmatter } from './parser'

/**
 * Scan docs directory and build navigation tree
 * 
 * @example
 * ```ts
 * const tree = await scanDocsTree('./docs', { basePath: '/docs' })
 * // [
 * //   { name: 'Getting Started', path: '/docs/getting-started', ... },
 * //   { name: 'Components', path: '/docs/components', children: [...] }
 * // ]
 * ```
 */
export async function scanDocsTree(
  docsDir: string,
  options: {
    basePath?: string
    sort?: 'alphabetical' | 'frontmatter'
  } = {}
): Promise<DocsTreeEntry[]> {
  const { basePath = '', sort = 'frontmatter' } = options
  
  const entries = await scanDirectory(docsDir, docsDir, basePath)
  
  // Sort entries
  sortEntries(entries, sort)
  
  return entries
}

/**
 * Recursively scan directory for MDX files
 */
async function scanDirectory(
  currentDir: string,
  rootDir: string,
  basePath: string
): Promise<DocsTreeEntry[]> {
  const entries: DocsTreeEntry[] = []
  
  let dirEntries: Awaited<ReturnType<typeof readdir>>
  try {
    dirEntries = await readdir(currentDir, { withFileTypes: true })
  } catch {
    return entries
  }
  
  // Separate files and directories
  const files: typeof dirEntries = []
  const dirs: typeof dirEntries = []
  
  for (const entry of dirEntries) {
    if (entry.isDirectory()) {
      dirs.push(entry)
    } else if (entry.isFile() && isMdxFile(entry.name)) {
      files.push(entry)
    }
  }
  
  // Process MDX files
  for (const file of files) {
    const filePath = join(currentDir, file.name)
    const relativePath = relative(rootDir, filePath)
    const entry = await createEntryFromFile(filePath, relativePath, basePath)
    if (entry) {
      entries.push(entry)
    }
  }
  
  // Process subdirectories
  for (const dir of dirs) {
    const dirPath = join(currentDir, dir.name)
    const children = await scanDirectory(dirPath, rootDir, basePath)
    
    if (children.length > 0) {
      // Check for index.mdx in directory
      const indexEntry = children.find(c => c.isIndex)
      const nonIndexChildren = children.filter(c => !c.isIndex)
      
      const dirEntry: DocsTreeEntry = {
        name: indexEntry?.frontmatter.title as string || formatName(dir.name),
        path: `${basePath}/${dir.name}`,
        filePath: `${dir.name}/`,
        frontmatter: indexEntry?.frontmatter || {},
        children: nonIndexChildren,
        isIndex: false,
      }
      
      entries.push(dirEntry)
    }
  }
  
  return entries
}

/**
 * Create tree entry from MDX file
 */
async function createEntryFromFile(
  absolutePath: string,
  relativePath: string,
  basePath: string
): Promise<DocsTreeEntry | null> {
  try {
    const source = await readFile(absolutePath, 'utf-8')
    const { frontmatter } = parseFrontmatter(source)
    
    const fileName = basename(relativePath)
    const isIndex = fileName === 'index.mdx' || fileName === 'index.md'
    
    // Build URL path
    let urlPath: string
    if (isIndex) {
      // index.mdx → directory path
      const dirPath = dirname(relativePath)
      urlPath = dirPath === '.' ? basePath || '/' : `${basePath}/${dirPath}`
    } else {
      // component.mdx → /component
      const withoutExt = relativePath.replace(/\.(mdx?|md)$/, '')
      urlPath = `${basePath}/${withoutExt}`
    }
    
    return {
      name: frontmatter.title as string || formatName(basename(relativePath, '.mdx')),
      path: urlPath,
      filePath: relativePath,
      frontmatter,
      isIndex,
    }
  } catch (error) {
    console.warn(`Failed to parse ${absolutePath}:`, error)
    return null
  }
}

/**
 * Sort entries by specified order
 */
function sortEntries(entries: DocsTreeEntry[], sort: 'alphabetical' | 'frontmatter'): void {
  entries.sort((a, b) => {
    if (sort === 'frontmatter') {
      // Sort by frontmatter.order, then alphabetically
      const orderA = (a.frontmatter.order as number) ?? 999
      const orderB = (b.frontmatter.order as number) ?? 999
      if (orderA !== orderB) return orderA - orderB
    }
    return a.name.localeCompare(b.name)
  })
  
  // Recursively sort children
  for (const entry of entries) {
    if (entry.children) {
      sortEntries(entry.children, sort)
    }
  }
}

/**
 * Check if file is MDX/Markdown
 */
function isMdxFile(fileName: string): boolean {
  const lower = fileName.toLowerCase()
  return lower.endsWith('.mdx') || lower.endsWith('.md')
}

/**
 * Format filename to display name
 * 'getting-started' → 'Getting Started'
 */
function formatName(fileName: string): string {
  return fileName
    .replace(/\.(mdx?|md)$/, '')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

/**
 * Flatten tree to list of all pages
 */
export function flattenDocsTree(tree: DocsTreeEntry[]): DocsTreeEntry[] {
  const result: DocsTreeEntry[] = []
  
  for (const entry of tree) {
    // Add entry if it has a file (not just a directory container)
    if (!entry.filePath.endsWith('/') || entry.isIndex) {
      result.push(entry)
    }
    
    if (entry.children) {
      result.push(...flattenDocsTree(entry.children))
    }
  }
  
  return result
}

/**
 * Build sidebar items from docs tree
 */
export function buildSidebarFromTree(tree: DocsTreeEntry[]): Array<{
  text: string
  link?: string
  items?: Array<{ text: string; link: string }>
}> {
  return tree.map(entry => ({
    text: entry.name,
    link: entry.children ? undefined : entry.path,
    items: entry.children?.map(child => ({
      text: child.name,
      link: child.path,
    })),
  }))
}
