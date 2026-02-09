import { Block, Box, Container } from '@ui8kit/core';
import { Sidebar } from '../partials/Sidebar';
import { Header } from '../partials/Header';
import { Footer } from '../partials/Footer';

interface DashLayoutProps {
  children?: ReactNode;
  sidebar?: ReactNode;
}

export function DashLayout(props: DashLayoutProps) {
  const { children, sidebar } = props;
  return (
    <Block component="main" data-role="dash-main" w="full" flex="" data-class="main">
      <aside data-class="sidebar-desktop" className="hidden md:flex w-64 shrink-0 border-r border-border">
        <Box w="full" h="full" data-class="sidebar-desktop-content" className="overflow-auto">
          <Sidebar>
            {sidebar}
          </Sidebar>
        </Box>
      </aside>
      <Box flex="col" w="full" data-class="main-content-wrapper" className="flex-1 overflow-auto">
        <Box p="4" bg="muted" data-class="main-content-box">
          <Container data-class="main-content-container">
            <Header title={""} subtitle={""} navItems={[]} />
            {children}
            <Footer copyright={""} sections={[]} />
          </Container>
        </Box>
      </Box>
    </Block>
  );
}
