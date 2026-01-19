import React, { createContext, useContext, useMemo, type ReactNode, type ComponentType } from 'react'
import type { Frontmatter, TocEntry, PageContent } from '../types'

/**
 * Page content context value
 */
interface PageContextValue {
  Content: ComponentType<Record<string, unknown>>
  frontmatter: Frontmatter
  toc: TocEntry[]
  excerpt?: string
}

const PageContext = createContext<PageContextValue | null>(null)

/**
 * Provider for current page content
 * 
 * @example
 * ```tsx
 * // In your docs layout
 * <PageContentProvider
 *   content={Content}
 *   frontmatter={frontmatter}
 *   toc={toc}
 * >
 *   <DocsLayout />
 * </PageContentProvider>
 * ```
 */
export interface PageContentProviderProps {
  children: ReactNode
  content: ComponentType<Record<string, unknown>>
  frontmatter: Frontmatter
  toc: TocEntry[]
  excerpt?: string
}

export function PageContentProvider({
  children,
  content: Content,
  frontmatter,
  toc,
  excerpt,
}: PageContentProviderProps): React.ReactElement {
  const value = useMemo(() => ({
    Content,
    frontmatter,
    toc,
    excerpt,
  }), [Content, frontmatter, toc, excerpt])
  
  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  )
}

/**
 * Hook to access current page content
 * 
 * Returns the MDX content component, frontmatter, and TOC
 * for the currently active documentation page.
 * 
 * @example
 * ```tsx
 * function DocsPage() {
 *   const { Content, frontmatter, toc } = usePageContent()
 *   
 *   return (
 *     <article>
 *       <h1>{frontmatter.title}</h1>
 *       <TableOfContents items={toc} />
 *       <Content />
 *     </article>
 *   )
 * }
 * ```
 */
export function usePageContent(): PageContent {
  const context = useContext(PageContext)
  
  if (!context) {
    throw new Error(
      'usePageContent must be used within a PageContentProvider. ' +
      'Make sure your docs layout is wrapped with PageContentProvider.'
    )
  }
  
  return context
}

/**
 * Hook to access only the Table of Contents
 * 
 * @example
 * ```tsx
 * function TableOfContents() {
 *   const toc = useToc()
 *   
 *   return (
 *     <nav>
 *       {toc.map(item => (
 *         <a key={item.slug} href={`#${item.slug}`}>{item.text}</a>
 *       ))}
 *     </nav>
 *   )
 * }
 * ```
 */
export function useToc(): TocEntry[] {
  const context = useContext(PageContext)
  return context?.toc ?? []
}

/**
 * Hook to access only the frontmatter
 * 
 * @example
 * ```tsx
 * function PageHeader() {
 *   const frontmatter = useFrontmatter()
 *   
 *   return (
 *     <header>
 *       <h1>{frontmatter.title}</h1>
 *       <p>{frontmatter.description}</p>
 *     </header>
 *   )
 * }
 * ```
 */
export function useFrontmatter(): Frontmatter {
  const context = useContext(PageContext)
  return context?.frontmatter ?? {}
}
