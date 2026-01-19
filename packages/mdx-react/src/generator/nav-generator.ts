import { writeFile, mkdir } from 'node:fs/promises'
import { dirname } from 'node:path'
import type { 
  DocsTreeEntry, 
  NavItem, 
  DocsNavigation,
  Frontmatter,
} from '../core/types'

// ============================================================================
// Navigation Generator - Creates JSON for Liquid sidebar
// ============================================================================

/**
 * Convert docs tree to navigation structure
 */
export function docsTreeToNav(tree: DocsTreeEntry[]): NavItem[] {
  return tree.map(entry => treeEntryToNavItem(entry))
}

/**
 * Convert single tree entry to nav item
 */
function treeEntryToNavItem(entry: DocsTreeEntry): NavItem {
  const navItem: NavItem = {
    title: entry.frontmatter.title as string || entry.name,
    path: entry.path,
    order: entry.frontmatter.order as number | undefined,
  }
  
  if (entry.children && entry.children.length > 0) {
    navItem.children = entry.children.map(child => treeEntryToNavItem(child))
  }
  
  return navItem
}

/**
 * Sort navigation items by order, then alphabetically
 */
export function sortNavItems(items: NavItem[]): NavItem[] {
  const sorted = [...items].sort((a, b) => {
    // Sort by order first
    const orderA = a.order ?? 999
    const orderB = b.order ?? 999
    if (orderA !== orderB) return orderA - orderB
    
    // Then alphabetically
    return a.title.localeCompare(b.title)
  })
  
  // Recursively sort children
  for (const item of sorted) {
    if (item.children) {
      item.children = sortNavItems(item.children)
    }
  }
  
  return sorted
}

/**
 * Generate docs navigation JSON
 */
export async function generateDocsNavigation(
  tree: DocsTreeEntry[],
  outputPath: string
): Promise<DocsNavigation> {
  const items = docsTreeToNav(tree)
  const sortedItems = sortNavItems(items)
  
  const navigation: DocsNavigation = {
    items: sortedItems,
    generated: new Date().toISOString(),
  }
  
  // Ensure directory exists
  await mkdir(dirname(outputPath), { recursive: true })
  
  // Write JSON
  await writeFile(
    outputPath, 
    JSON.stringify(navigation, null, 2), 
    'utf-8'
  )
  
  console.log(`  → ${outputPath}`)
  
  return navigation
}

/**
 * Generate flat list of all doc pages (for search index)
 */
export function generateDocsIndex(tree: DocsTreeEntry[]): Array<{
  title: string
  path: string
  description?: string
  section?: string
}> {
  const index: Array<{
    title: string
    path: string
    description?: string
    section?: string
  }> = []
  
  function traverse(entries: DocsTreeEntry[], section?: string) {
    for (const entry of entries) {
      // Skip directory entries without index
      if (!entry.isIndex && entry.children) {
        traverse(entry.children, entry.name)
        continue
      }
      
      index.push({
        title: entry.frontmatter.title as string || entry.name,
        path: entry.path,
        description: entry.frontmatter.description as string | undefined,
        section,
      })
      
      if (entry.children) {
        traverse(entry.children, entry.name)
      }
    }
  }
  
  traverse(tree)
  return index
}
