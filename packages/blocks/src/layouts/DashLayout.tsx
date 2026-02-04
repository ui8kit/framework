import type { ComponentType, ReactNode } from 'react';
import { Block, Box, Container } from '@ui8kit/core';
import { Sidebar } from '../partials/Sidebar';
import { Header } from '../partials/Header';
import { Footer } from '../partials/Footer';

export interface DashboardProps {
  /** Optional page component to render in the main panel */
  page?: ComponentType;
  /** Optional children to render in the main panel (used if `page` is not provided) */
  children?: ReactNode;
  /** Optional sidebar content */
  sidebar?: ReactNode;
}

export function Dashboard({ page: Page, children, sidebar }: DashboardProps) {
  return (
    <>
      <Block component="main" data-role="dash-main" w="full" flex="" data-class="main">
        {/* Desktop Sidebar */}
        <aside data-class="sidebar-desktop" className="hidden md:flex w-64 shrink-0 border-r border-border">
          <Box w="full" h="full" data-class="sidebar-desktop-content" className="overflow-auto">
            <Sidebar>{sidebar}</Sidebar>
          </Box>
        </aside>

        {/* Main Content */}
        <Box flex="col" w="full" data-class="main-content-wrapper" className="flex-1 overflow-auto">
          <Box p="4" bg="muted" data-class="main-content-box">
            <Container data-class="main-content-container">
              <Header />
              {Page ? <Page /> : children}
              <Footer />
            </Container>
          </Box>
        </Box>
      </Block>
    </>
  );
}

// Default export: factory alias
export function DashLayout(props: DashboardProps) {
  return <Dashboard {...props} />;
}
