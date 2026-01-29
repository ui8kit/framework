import { ReactNode } from 'react'
import { Block, Container, Grid, Stack } from '@ui8kit/core'
import { Header } from '@/partials/Header'
import { Footer } from '@/partials/Footer'
import { Sidebar } from '@/partials/Sidebar'

export type LayoutMode = 'full' | 'with-sidebar' | 'sidebar-left'

type NavItem = {
  id: string
  title: string
  url: string
}

type FooterLink = {
  label: string
  href: string
}

type FooterSection = {
  title: string
  links: FooterLink[]
}

type MainLayoutProps = {
  children: ReactNode
  mode?: LayoutMode
  sidebar?: ReactNode
  navItems?: NavItem[]
  footerSections?: FooterSection[]
  headerTitle?: string
  headerSubtitle?: string
  footerCopyright?: string
  showHeader?: boolean
  showFooter?: boolean
}

export function MainLayout({
  children,
  mode = 'with-sidebar',
  sidebar,
  navItems = [],
  footerSections = [],
  headerTitle = 'UI8Kit',
  headerSubtitle = 'Design System',
  footerCopyright = '© 2025 UI8Kit Design System. All rights reserved.',
  showHeader = true,
  showFooter = true,
}: MainLayoutProps) {
  const isSidebarLeft = mode === 'sidebar-left'
  const hasSidebar = (mode === 'with-sidebar' || mode === 'sidebar-left') && sidebar

  return (
    <Stack gap="0" h="full" data-class="main-layout">
      {/* Header */}
      {showHeader && (
        <Header 
          title={headerTitle}
          subtitle={headerSubtitle}
          navItems={navItems}
          data-class="main-layout-header"
        />
      )}

      {/* Main Content */}
      <Block component="main" flex="1" py="8" data-class="main-layout-content">
        <Container max="w-6xl" mx="auto" px="4" data-class="main-layout-container">
          {hasSidebar ? (
            <Grid 
              grid="cols-3" 
              gap="8"
              data-class="main-layout-grid"
              className="md:grid-cols-3 grid-cols-1"
            >
              {/* Content Column - 2 columns on desktop, full width on mobile */}
              <Stack 
                col="span-2"
                gap="6"
                order={isSidebarLeft ? "2" : "1"}
                data-class="main-layout-main"
                className="md:col-span-2 col-span-1"
              >
                {children}
              </Stack>

              {/* Sidebar Column - 1 column on desktop, full width on mobile */}
              <Stack
                col="span-1"
                order={isSidebarLeft ? "1" : "2"}
                data-class="main-layout-sidebar-wrapper"
                className="md:col-span-1 col-span-1"
              >
                <Sidebar position={isSidebarLeft ? 'left' : 'right'}>
                  {sidebar}
                </Sidebar>
              </Stack>
            </Grid>
          ) : (
            <Stack gap="6" data-class="main-layout-full">
              {children}
            </Stack>
          )}
        </Container>
      </Block>

      {/* Footer */}
      {showFooter && (
        <Footer 
          copyright={footerCopyright}
          sections={footerSections}
          data-class="main-layout-footer"
        />
      )}
    </Stack>
  )
}
