import { createRoot } from 'react-dom/client'
import { StrictMode } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ThemeProvider, lesseUITheme } from '@/providers/theme'
import App from '@/App'
import NotFound from '@/exceptions/NotFound'
import ErrorBoundary from '@/exceptions/ErrorBoundary'
// routes
import { Blank } from '@/routes/Blank'
// HomePage
import { HomePage } from '@/routes/HomePage'

// styles
import './assets/css/index.css'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorBoundary />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'about', element: <Blank /> },
      { path: 'blog', element: <Blank /> },
      { path: 'contact', element: <Blank /> },
      { path: '*', element: <NotFound /> }
    ]
  }
])

createRoot(document.getElementById('app')!).render(
  <StrictMode>
    <ThemeProvider theme={lesseUITheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
)
