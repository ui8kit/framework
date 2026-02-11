import { Fragment, ReactNode } from 'react';
import { Block, Container, Grid, Stack } from '@ui8kit/core';
import { Header } from '../partials/Header';
import { Footer } from '../partials/Footer';
import { Sidebar } from '../partials/Sidebar';
import type { NavItem, FooterSection } from '../partials';

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
    <Fragment>
      {showHeader ?? true ? (<><Header title={headerTitle ?? 'UI8Kit'} subtitle={headerSubtitle ?? 'Design System'} navItems={navItems ?? []} dataClass={"main-layout-header"} /></>) : null}
      <Block component="main" flex="1" py="8" data-class="main-layout-content">
        {(mode ?? 'with-sidebar') === 'with-sidebar' || (mode ?? 'with-sidebar') === 'sidebar-left' ? (<>{!!sidebar ? (<><Container data-class="main-layout-container"><Grid grid="cols-3" gap="8" data-class="main-layout-grid">{(mode ?? 'with-sidebar') === 'sidebar-left' ? (<><Stack col="span-2" gap="6" order="2" data-class="main-layout-main">{children}</Stack><Stack col="span-1" order="1" data-class="main-layout-sidebar-wrapper"><Sidebar position={"left"}>{sidebar}</Sidebar></Stack></>) : null}{(mode ?? 'with-sidebar') !== 'sidebar-left' ? (<><Stack col="span-2" gap="6" order="1" data-class="main-layout-main">{children}</Stack><Stack col="span-1" order="2" data-class="main-layout-sidebar-wrapper"><Sidebar position={"right"}>{sidebar}</Sidebar></Stack></>) : null}</Grid></Container></>) : null}</>) : null}
        {(mode ?? 'with-sidebar') === 'full' || !sidebar ? (<><Container flex="col" gap="6" data-class="main-layout-container">{children}</Container></>) : null}
      </Block>
      {showFooter ?? true ? (<><Footer copyright={footerCopyright ?? '© 2025 UI8Kit Design System. All rights reserved.'} sections={footerSections ?? []} dataClass={"main-layout-footer"} /></>) : null}
    </Fragment>
  );
}
