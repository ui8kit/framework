import { Suspense, useState, useEffect } from 'react'
import { useLocation, Link } from 'react-router-dom'
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

// Build navigation from available MDX files
const availablePaths = Object.keys(mdxModules).map(path => {
  // ../../docs/components/button.mdx → /components/button
  return path
    .replace('../../docs', '')
    .replace(/\/index\.mdx$/, '')
    .replace(/\.mdx$/, '') || '/'
})

// Debug: log available paths in development
if (import.meta.env.DEV) {
  console.log('Available routes:', availablePaths)
}

/**
 * Get MDX module path from URL pathname
 * 
 * /                    → ../../docs/index.mdx
 * /components          → ../../docs/components/index.mdx
 * /components/button   → ../../docs/components/button.mdx
 */
function getMdxPath(pathname: string): string {
  // Normalize pathname
  const slug = pathname === '/' ? '' : pathname.replace(/^\//, '')
  
  // Handle root
  if (!slug) {
    return '../../docs/index.mdx'
  }
  
  // First try exact file match: /components/button → ../../docs/components/button.mdx
  const filePath = `../../docs/${slug}.mdx`
  if (mdxModules[filePath]) {
    return filePath
  }
  
  // Then try index file: /components → ../../docs/components/index.mdx
  const indexPath = `../../docs/${slug}/index.mdx`
  if (mdxModules[indexPath]) {
    return indexPath
  }
  
  // Return file path anyway (will show 404)
  return filePath
}

// =============================================================================
// Docs Page - Main Component
// =============================================================================

/**
 * Documentation page component
 * Handles ALL routes - loads MDX based on URL path
 * 
 * URL → MDX file mapping:
 *   /                    → docs/index.mdx
 *   /components          → docs/components/index.mdx
 *   /components/button   → docs/components/button.mdx
 */
export function DocsPage() {
  const location = useLocation()
  const mdxPath = getMdxPath(location.pathname)
  
  // Check if MDX file exists
  const loader = mdxModules[mdxPath]
  
  if (!loader) {
    return <DocsNotFound pathname={location.pathname} />
  }
  
  return (
    <Suspense fallback={<DocsLoading />}>
      <MdxPageLoader loader={loader} key={mdxPath} />
    </Suspense>
  )
}

// =============================================================================
// MDX Page Loader
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
 * Loads MDX module and renders with layout
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
// Docs Layout
// =============================================================================

/**
 * Documentation page layout with sidebar and TOC
 */
function DocsLayout() {
  const { Content, frontmatter } = usePageContent()
  
  return (
    <div className="docs-page" data-class="docs-page">
      {/* Sidebar Navigation */}
      <aside className="docs-sidebar" data-class="docs-sidebar">
        <DocsNavigation />
      </aside>
      
      <div className="docs-main" data-class="docs-main">
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
        
        {/* Table of Contents */}
        <aside className="docs-toc" data-class="docs-toc">
          <TableOfContents />
        </aside>
      </div>
    </div>
  )
}

// =============================================================================
// Navigation Components
// =============================================================================

/**
 * Sidebar navigation built from available MDX files
 */
function DocsNavigation() {
  const location = useLocation()
  
  return (
    <nav className="docs-nav" data-class="docs-nav">
      <div className="docs-nav-header" data-class="docs-nav-header">
        <Link to="/" className="docs-nav-brand" data-class="docs-nav-brand">
          UI8Kit
        </Link>
      </div>
      
      <ul className="docs-nav-list" data-class="docs-nav-list">
        {availablePaths.map((path) => {
          const isActive = location.pathname === path
          const label = path === '/' 
            ? 'Home' 
            : path.split('/').pop()?.replace(/-/g, ' ') || path
          
          return (
            <li key={path} className="docs-nav-item" data-class="docs-nav-item">
              <Link 
                to={path}
                className={`docs-nav-link ${isActive ? 'active' : ''}`}
                data-class="docs-nav-link"
                data-active={isActive}
              >
                {label.charAt(0).toUpperCase() + label.slice(1)}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

/**
 * Table of Contents for current page
 */
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
      <p>Loading...</p>
    </div>
  )
}

function DocsNotFound({ pathname }: { pathname: string }) {
  return (
    <div className="docs-not-found" data-class="docs-not-found">
      <h1>Page Not Found</h1>
      <p>The page "{pathname}" could not be found.</p>
      
      <h2>Available Pages</h2>
      <ul>
        {availablePaths.map(path => (
          <li key={path}>
            <Link to={path}>{path || '/'}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
