import { ReactNode } from 'react';
import { Block, Container, Grid, Stack } from '@ui8kit/core';
import { Header } from '../partials/Header';
import { Footer } from '../partials/Footer';
import { Sidebar } from '../partials/Sidebar';
import { If } from '@ui8kit/template';
import type { NavItem, FooterSection } from '../partials';

export type LayoutMode = 'full' | 'with-sidebar' | 'sidebar-left';

export type MainLayoutProps = {
  children: ReactNode;
  mode?: LayoutMode;
  sidebar?: ReactNode;
  navItems?: NavItem[];
  footerSections?: FooterSection[];
  headerTitle?: string;
  headerSubtitle?: string;
  footerCopyright?: string;
  showHeader?: boolean;
  showFooter?: boolean;
};

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
  const isSidebarLeft = mode === 'sidebar-left';
  const hasSidebar = (mode === 'with-sidebar' || mode === 'sidebar-left') && sidebar;

  return (
    <Block data-class="main-layout">
      {/* Header */}
      <If test="showHeader" value={showHeader}>
        <Header 
          title={headerTitle}
          subtitle={headerSubtitle}
          navItems={navItems}
          data-class="main-layout-header"
        />
      </If>

      {/* Main Content */}
      <Block component="main" flex="1" py="8" data-class="main-layout-content">
        <Container data-class="main-layout-container">
          {hasSidebar ? (
            <Grid 
              grid="cols-3" 
              gap="8"
              data-class="main-layout-grid"
            >
              {/* Content Column */}
              <Stack 
                col="span-2"
                gap="6"
                order={isSidebarLeft ? "2" : "1"}
                data-class="main-layout-main"
              >
                {children}
              </Stack>

              {/* Sidebar Column */}
              <Stack
                col="span-1"
                order={isSidebarLeft ? "1" : "2"}
                data-class="main-layout-sidebar-wrapper"
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
      <If test="showFooter" value={showFooter}>
        <Footer 
          copyright={footerCopyright}
          sections={footerSections}
          data-class="main-layout-footer"
        />
      </If>
    </Block>
  );
}
