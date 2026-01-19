import type { Frontmatter, TocEntry, TocConfig } from './types'
import { slugify, uniqueSlug } from './slugify'

/**
 * Parse frontmatter from MDX content
 * 
 * @example
 * ```ts
 * const { frontmatter, content } = parseFrontmatter(`---
 * title: Hello
 * description: World
 * ---
 * 
 * # Content here
 * `)
 * ```
 */
export function parseFrontmatter(source: string): { 
  frontmatter: Frontmatter
  content: string 
} {
  const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/
  const match = frontmatterRegex.exec(source)
  
  if (!match) {
    return {
      frontmatter: {},
      content: source,
    }
  }
  
  const frontmatterBlock = match[1]
  const content = source.slice(match[0].length)
  
  // Parse YAML-like frontmatter (simple key: value pairs)
  const frontmatter: Frontmatter = {}
  const lines = frontmatterBlock.split('\n')
  
  for (const line of lines) {
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue
    
    const key = line.slice(0, colonIndex).trim()
    let value: string | number | boolean = line.slice(colonIndex + 1).trim()
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    // Parse numbers
    else if (/^\d+$/.test(value)) {
      value = parseInt(value, 10)
    }
    // Parse booleans
    else if (value === 'true') {
      value = true
    } else if (value === 'false') {
      value = false
    }
    
    frontmatter[key] = value
  }
  
  return { frontmatter, content }
}

/**
 * Extract Table of Contents from MDX/Markdown content
 * 
 * @example
 * ```ts
 * const toc = extractToc(`
 * # Main Title
 * ## Section One
 * ### Subsection
 * ## Section Two
 * `, { minLevel: 2, maxLevel: 3 })
 * ```
 */
export function extractToc(
  content: string, 
  config: TocConfig = { minLevel: 2, maxLevel: 3 }
): TocEntry[] {
  const { minLevel = 2, maxLevel = 3 } = config
  
  // Match ATX-style headings: ## Heading
  const headingRegex = /^(#{1,6})\s+(.+?)(?:\s+\{#([\w-]+)\})?$/gm
  const entries: TocEntry[] = []
  const slugs = new Set<string>()
  
  let match: RegExpExecArray | null
  while ((match = headingRegex.exec(content)) !== null) {
    const depth = match[1].length
    const text = match[2].trim()
    // Support explicit slug: ## Heading {#custom-slug}
    const explicitSlug = match[3]
    
    // Filter by level range
    if (depth < minLevel || depth > maxLevel) continue
    
    const slug = explicitSlug || uniqueSlug(text, slugs)
    
    entries.push({
      depth,
      text,
      slug,
    })
  }
  
  return entries
}

/**
 * Build hierarchical TOC from flat entries
 * 
 * Converts flat list to nested structure based on heading levels
 */
export function buildHierarchicalToc(entries: TocEntry[]): TocEntry[] {
  if (entries.length === 0) return []
  
  const root: TocEntry[] = []
  const stack: { entry: TocEntry; depth: number }[] = []
  
  for (const entry of entries) {
    const item: TocEntry = { ...entry, children: [] }
    
    // Pop stack until we find a parent with smaller depth
    while (stack.length > 0 && stack[stack.length - 1].depth >= entry.depth) {
      stack.pop()
    }
    
    if (stack.length === 0) {
      // Top level
      root.push(item)
    } else {
      // Add as child of last stack item
      const parent = stack[stack.length - 1].entry
      if (!parent.children) parent.children = []
      parent.children.push(item)
    }
    
    stack.push({ entry: item, depth: entry.depth })
  }
  
  // Clean up empty children arrays
  const cleanup = (entries: TocEntry[]) => {
    for (const entry of entries) {
      if (entry.children?.length === 0) {
        delete entry.children
      } else if (entry.children) {
        cleanup(entry.children)
      }
    }
  }
  cleanup(root)
  
  return root
}

/**
 * Extract first paragraph as excerpt
 */
export function extractExcerpt(content: string, maxLength = 200): string | undefined {
  // Remove imports and JSX components
  const cleaned = content
    .replace(/^import\s+.*$/gm, '')
    .replace(/<[^>]+\/>/g, '')
    .replace(/<[^>]+>[\s\S]*?<\/[^>]+>/g, '')
    .trim()
  
  // Find first paragraph (non-heading, non-empty text)
  const lines = cleaned.split('\n')
  let excerpt = ''
  
  for (const line of lines) {
    const trimmed = line.trim()
    // Skip headings, empty lines, code blocks
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('```')) {
      continue
    }
    excerpt = trimmed
    break
  }
  
  if (!excerpt) return undefined
  
  // Truncate if needed
  if (excerpt.length > maxLength) {
    excerpt = excerpt.slice(0, maxLength).trim() + '...'
  }
  
  return excerpt
}

/**
 * Parse complete MDX file
 * 
 * Returns frontmatter, content, TOC, and excerpt
 */
export function parseMdxFile(source: string, tocConfig?: TocConfig): {
  frontmatter: Frontmatter
  content: string
  toc: TocEntry[]
  excerpt?: string
} {
  const { frontmatter, content } = parseFrontmatter(source)
  const toc = extractToc(content, tocConfig)
  const excerpt = extractExcerpt(content)
  
  return {
    frontmatter,
    content,
    toc,
    excerpt,
  }
}
