import { Fragment, ReactNode } from 'react';
import { Block, Container, Grid, Stack } from '@ui8kit/core';
import { If } from '@ui8kit/template';
import { Header } from '../../partials/Header';
import { Footer } from '../../partials/Footer';
import { Sidebar } from '../../partials/Sidebar';
import type { NavItem, FooterSection } from '../../partials';

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

export function MainLayoutView({
  children,
  mode,
  sidebar,
  navItems,
  footerSections,
  headerTitle,
  headerSubtitle,
  footerCopyright,
  showHeader,
  showFooter,
}: MainLayoutProps) {
  return (
    <Fragment>
      <If test="showHeader ?? true" value={showHeader ?? true}>
        <Header
          title={headerTitle ?? 'UI8Kit'}
          subtitle={headerSubtitle ?? 'Design System'}
          navItems={navItems ?? []}
          dataClass="main-layout-header"
        />
      </If>

      {/* Main Content */}
      <Block component="main" flex="1" py="8" data-class="main-layout-content">
        <If
          test="(mode ?? 'with-sidebar') === 'with-sidebar' || (mode ?? 'with-sidebar') === 'sidebar-left'"
          value={(mode ?? 'with-sidebar') === 'with-sidebar' || (mode ?? 'with-sidebar') === 'sidebar-left'}
        >
          <If test="!!sidebar" value={!!sidebar}>
            <Container data-class="main-layout-container">
              <Grid
                grid="cols-3"
                gap="8"
                data-class="main-layout-grid"
              >
                <If test="(mode ?? 'with-sidebar') === 'sidebar-left'" value={(mode ?? 'with-sidebar') === 'sidebar-left'}>
                  <>
                    <Stack
                      col="span-2"
                      gap="6"
                      order="2"
                      data-class="main-layout-main"
                    >
                      {children}
                    </Stack>

                    <Stack
                      col="span-1"
                      order="1"
                      data-class="main-layout-sidebar-wrapper"
                    >
                      <Sidebar position="left">
                        {sidebar}
                      </Sidebar>
                    </Stack>
                  </>
                </If>

                <If test="(mode ?? 'with-sidebar') !== 'sidebar-left'" value={(mode ?? 'with-sidebar') !== 'sidebar-left'}>
                  <>
                    <Stack
                      col="span-2"
                      gap="6"
                      order="1"
                      data-class="main-layout-main"
                    >
                      {children}
                    </Stack>

                    <Stack
                      col="span-1"
                      order="2"
                      data-class="main-layout-sidebar-wrapper"
                    >
                      <Sidebar position="right">
                        {sidebar}
                      </Sidebar>
                    </Stack>
                  </>
                </If>
              </Grid>
            </Container>
          </If>
        </If>

        <If
          test="(mode ?? 'with-sidebar') === 'full' || !sidebar"
          value={(mode ?? 'with-sidebar') === 'full' || !sidebar}
        >
          <Container
            flex="col"
            gap="6"
            data-class="main-layout-container"
          >
            {children}
          </Container>
        </If>
      </Block>

      <If test="showFooter ?? true" value={showFooter ?? true}>
        <Footer
          copyright={footerCopyright ?? '© 2025 UI8Kit Design System. All rights reserved.'}
          sections={footerSections ?? []}
          dataClass="main-layout-footer"
        />
      </If>
    </Fragment>
  );
}
