import { Suspense, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageContentProvider, usePageContent, useToc } from '@ui8kit/mdx-react'
import type { TocEntry, Frontmatter } from '@ui8kit/mdx-react'

// =============================================================================
// MDX Pages - Dynamic Import via Vite glob
// =============================================================================

interface MdxModule {
  default: React.ComponentType<Record<string, unknown>>
  frontmatter?: Frontmatter
  toc?: TocEntry[]
}

/**
 * Import all MDX files from docs directory
 * Each module exports: default (Content), frontmatter, toc
 */
const mdxModules = import.meta.glob<MdxModule>('../../docs/**/*.mdx')

// Debug: log available paths in development
if (import.meta.env.DEV) {
  console.log('Available MDX paths:', Object.keys(mdxModules))
}

/**
 * Get MDX module path from URL params
 */
function getMdxPath(slug?: string): string {
  // Handle empty slug (docs index)
  if (!slug || slug === '') {
    return '../../docs/index.mdx'
  }
  
  // First try exact file match: /docs/components/button → ../../docs/components/button.mdx
  const filePath = `../../docs/${slug}.mdx`
  if (mdxModules[filePath]) {
    return filePath
  }
  
  // Then try index file: /docs/components → ../../docs/components/index.mdx
  const indexPath = `../../docs/${slug}/index.mdx`
  if (mdxModules[indexPath]) {
    return indexPath
  }
  
  // Return file path anyway (will show 404)
  return filePath
}

// =============================================================================
// Docs Page Route
// =============================================================================

/**
 * Main documentation page route
 * 
 * Handles dynamic MDX loading based on URL:
 * - /docs → docs/index.mdx
 * - /docs/components/button → docs/components/button.mdx
 * - /docs/components → docs/components/index.mdx
 */
export function DocsPage() {
  const { '*': slug } = useParams()
  const mdxPath = getMdxPath(slug)
  
  // Check if MDX file exists
  const loader = mdxModules[mdxPath]
  
  if (!loader) {
    console.log('MDX not found:', mdxPath, 'slug:', slug)
    return <DocsNotFound slug={slug} availablePaths={Object.keys(mdxModules)} />
  }
  
  return (
    <Suspense fallback={<DocsLoading />}>
      <MdxPageLoader loader={loader} key={mdxPath} />
    </Suspense>
  )
}

// =============================================================================
// MDX Page Loader - uses state instead of lazy()
// =============================================================================

interface MdxPageLoaderProps {
  loader: () => Promise<MdxModule>
}

interface LoadedModule {
  Content: React.ComponentType<Record<string, unknown>>
  frontmatter: Frontmatter
  toc: TocEntry[]
}

/**
 * Loads MDX module and wraps with PageContentProvider
 */
function MdxPageLoader({ loader }: MdxPageLoaderProps) {
  const [module, setModule] = useState<LoadedModule | null>(null)
  const [error, setError] = useState<Error | null>(null)
  
  useEffect(() => {
    let cancelled = false
    
    setModule(null)
    setError(null)
    
    loader()
      .then((mod) => {
        if (cancelled) return
        
        if (import.meta.env.DEV) {
          console.log('Loaded MDX module:', {
            hasDefault: !!mod.default,
            frontmatter: mod.frontmatter,
            toc: mod.toc,
          })
        }
        
        setModule({
          Content: mod.default,
          frontmatter: mod.frontmatter || {},
          toc: mod.toc || [],
        })
      })
      .catch((err) => {
        if (cancelled) return
        console.error('Failed to load MDX:', err)
        setError(err)
      })
    
    return () => {
      cancelled = true
    }
  }, [loader])
  
  if (error) {
    return (
      <div className="docs-error" data-class="docs-error">
        <h1>Error Loading Page</h1>
        <p>{error.message}</p>
      </div>
    )
  }
  
  if (!module) {
    return <DocsLoading />
  }
  
  return (
    <PageContentProvider
      content={module.Content as any}
      frontmatter={module.frontmatter}
      toc={module.toc}
    >
      <DocsLayout />
    </PageContentProvider>
  )
}

// =============================================================================
// Docs Layout (inside PageContentProvider)
// =============================================================================

/**
 * Documentation page layout
 * Uses hooks to access page content from context
 */
function DocsLayout() {
  const { Content, frontmatter } = usePageContent()
  
  return (
    <div className="docs-page" data-class="docs-page">
      <div className="docs-container" data-class="docs-container">
        {/* Main Content */}
        <article className="docs-content" data-class="docs-content">
          {frontmatter.title && (
            <header className="docs-header" data-class="docs-header">
              <h1 className="docs-title" data-class="docs-title">
                {frontmatter.title}
              </h1>
              {frontmatter.description && (
                <p className="docs-description" data-class="docs-description">
                  {frontmatter.description as string}
                </p>
              )}
            </header>
          )}
          
          <div className="docs-body" data-class="docs-body">
            <Content />
          </div>
        </article>
        
        {/* Table of Contents Sidebar */}
        <aside className="docs-toc" data-class="docs-toc">
          <TableOfContents />
        </aside>
      </div>
    </div>
  )
}

// =============================================================================
// Table of Contents Component
// =============================================================================

function TableOfContents() {
  const toc = useToc()
  
  if (toc.length === 0) return null
  
  return (
    <nav className="toc" data-class="toc" aria-label="Table of Contents">
      <h2 className="toc-title" data-class="toc-title">On This Page</h2>
      <ul className="toc-list" data-class="toc-list">
        {toc.map((item) => (
          <li 
            key={item.slug} 
            className="toc-item" 
            data-class="toc-item"
            data-depth={item.depth}
          >
            <a 
              href={`#${item.slug}`} 
              className="toc-link"
              data-class="toc-link"
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}

// =============================================================================
// Fallback Components
// =============================================================================

function DocsLoading() {
  return (
    <div className="docs-loading" data-class="docs-loading">
      <p>Loading documentation...</p>
    </div>
  )
}

function DocsNotFound({ slug, availablePaths }: { slug?: string; availablePaths?: string[] }) {
  return (
    <div className="docs-not-found" data-class="docs-not-found">
      <h1>Page Not Found</h1>
      <p>The documentation page "{slug || 'index'}" could not be found.</p>
      {import.meta.env.DEV && availablePaths && (
        <details>
          <summary>Available pages ({availablePaths.length})</summary>
          <ul>
            {availablePaths.map(path => (
              <li key={path}><code>{path}</code></li>
            ))}
          </ul>
        </details>
      )}
    </div>
  )
}
