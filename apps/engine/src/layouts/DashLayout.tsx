import type { ReactNode } from 'react';
import { Block, Box, Container } from '@ui8kit/core';
import { Sidebar } from '../partials/Sidebar';
import { Header } from '../partials/Header';
import { Footer } from '../partials/Footer';

export interface DashLayoutProps {
  /** Main panel content (blocks or page component). */
  children?: ReactNode;
  /** Sidebar content (e.g. <DashSidebar />). */
  sidebar?: ReactNode;
}

/**
 * Dashboard layout: desktop sidebar + main content area with Header and Footer.
 * Single export so the generator emits the full body (copy-paste ready).
 */
export function DashLayout({ children, sidebar }: DashLayoutProps) {
  return (
    <Block component="div" data-role="dash-main" w="full" flex="" data-class="dash-layout">
      <Block component="aside" data-class="sidebar-desktop" className="hidden md:flex w-64 shrink-0 border-r border-border">
        <Box w="full" h="full" data-class="sidebar-desktop-content" className="overflow-auto">
          <Sidebar>{sidebar}</Sidebar>
        </Box>
      </Block>
      <Block component="main" flex="col" w="full" data-class="main-content-wrapper" className="flex-1 overflow-auto">
        <Box p="4" bg="muted" data-class="main-content-box">
          <Container data-class="main-content-container">
            <Header title="" subtitle="" navItems={[]} />
            {children}
            <Footer copyright="" sections={[]} />
          </Container>
        </Box>
      </Block>
    </Block>
  );
}
