import { Fragment, ReactNode } from 'react';
import { Block, Box, Container } from '@ui8kit/core';
import { Sidebar } from '../../partials/Sidebar';
import { Header } from '../../partials/Header';
import { Footer } from '../../partials/Footer';

interface DashLayoutViewProps {
  children?: ReactNode;
  sidebar?: ReactNode;
}

export function DashLayoutView(props: DashLayoutViewProps) {
  const { children, sidebar } = props;

  return (
    <Fragment>
      <Block component="aside" data-class="sidebar-desktop" className="hidden md:flex w-64 shrink-0 border-r border-border">
        <Box w="full" h="full" data-class="sidebar-desktop-content" className="overflow-auto">
          <Sidebar>
            {sidebar}
          </Sidebar>
        </Box>
      </Block>
      <Block component="main" flex="col" w="full" data-class="main-content-wrapper" data-role="dash-main" className="flex-1 overflow-auto">
        <Box p="4" bg="muted" data-class="main-content-box">
          <Container data-class="main-content-container">
            <Header title={""} subtitle={""} navItems={[]} />
            {children}
            <Footer copyright={""} sections={[]} />
          </Container>
        </Box>
      </Block>
    </Fragment>
  );
}
