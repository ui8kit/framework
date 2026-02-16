// Re-export browser-safe utilities from core
// For scanner functions (fs-based), import from '@ui8kit/mdx-react/server'

export {
  slugify,
  uniqueSlug,
  parseFrontmatter,
  extractToc,
  buildHierarchicalToc,
  extractExcerpt,
  parseMdxFile,
} from '../core'
