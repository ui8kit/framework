/**
 * Convert text to URL-safe slug
 * 
 * @example
 * slugify('Hello World') // 'hello-world'
 * slugify('API Reference') // 'api-reference'
 * slugify('What is MDX?') // 'what-is-mdx'
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces with hyphens
    .replace(/\s+/g, '-')
    // Remove special characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Replace multiple hyphens with single
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Generate unique slug by appending number if duplicate
 */
export function uniqueSlug(text: string, existing: Set<string>): string {
  let slug = slugify(text)
  let counter = 1
  const base = slug
  
  while (existing.has(slug)) {
    slug = `${base}-${counter}`
    counter++
  }
  
  existing.add(slug)
  return slug
}
