import { ReactNode } from 'react';
import { Block, Container, Grid, Stack } from '@ui8kit/core';
import { Header } from '../partials/Header';
import { Footer } from '../partials/Footer';
import { Sidebar } from '../partials/Sidebar';

interface MainLayoutProps {
  children: ReactNode;
  mode?: any;
  sidebar?: ReactNode;
  navItems?: any[];
  footerSections?: any[];
  headerTitle?: string;
  headerSubtitle?: string;
  footerCopyright?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}

export function MainLayout(props: MainLayoutProps) {
  const { children, mode, sidebar, navItems, footerSections, headerTitle, headerSubtitle, footerCopyright, showHeader, showFooter } = props;
  return (
    <Block data-class="main-layout">
      {showHeader ? (<><Header title={headerTitle} subtitle={headerSubtitle} navItems={navItems} data-class={"main-layout-header"} /></>) : null}
      <Block component="main" flex="1" py="8" data-class="main-layout-content">
        <Container data-class="main-layout-container">
          {(mode === 'with-sidebar' || mode === 'sidebar-left') && sidebar ? (<><Grid grid="cols-3" gap="8" data-class="main-layout-grid"><Stack col="span-2" gap="6" order={mode === 'sidebar-left' ? "2" : "1"} data-class="main-layout-main">{children}</Stack><Stack col="span-1" order={mode === 'sidebar-left' ? "1" : "2"} data-class="main-layout-sidebar-wrapper"><Sidebar position={mode === 'sidebar-left' ? 'left' : 'right'}>{sidebar}</Sidebar></Stack></Grid></>) : (<><Stack gap="6" data-class="main-layout-full">{children}</Stack></>)}
        </Container>
      </Block>
      {showFooter ? (<><Footer copyright={footerCopyright} sections={footerSections} data-class={"main-layout-footer"} /></>) : null}
    </Block>
  );
}
