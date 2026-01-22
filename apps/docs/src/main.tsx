import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider, lesseUITheme } from '@/providers/theme'
import ErrorBoundary from '@/exceptions/ErrorBoundary'
import { DocsPage } from '@/routes/DocsPage'

// styles
import './assets/css/index.css'

/**
 * Docs-first application
 * All routes are handled by DocsPage which loads MDX from docs/ folder
 * 
 * Route mapping:
 *   /                    → docs/index.mdx
 *   /components          → docs/components/index.mdx
 *   /components/button   → docs/components/button.mdx
 *   /get-started         → docs/get-started/index.mdx
 */
const router = createBrowserRouter([
  {
    path: '*',
    element: <DocsPage />,
    errorElement: <ErrorBoundary />,
  }
])

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <ThemeProvider theme={lesseUITheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
)
