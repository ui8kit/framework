//import React from "react";
import type { ComponentType, ReactNode } from "react";
import { Block, Box, Container } from "@ui8kit/core";
import { PanelGroup, Panel, PanelResizeHandle } from "react-resizable-panels";
import { Navbar, NavbarProps } from "@/partials/Navbar";
import { Sidebar } from "@/partials/Sidebar";
import { Header } from "@/partials/Header";
import { Footer } from "@/partials/Footer";

// Dashboard layout composing react-resizable-panels with ui8kit primitives
export interface DashboardProps {
  /** Optional page component to render in the main panel */
  page?: ComponentType;
  /** Optional children to render in the main panel (used if `page` is not provided) */
  children?: ReactNode;
  /** Optional sidebar content */
  sidebar?: ReactNode;
  /** Navbar props */
  navbarProps?: Omit<NavbarProps, "toggleDarkMode" | "isDarkMode"> &
    Partial<Pick<NavbarProps, "isDarkMode" | "toggleDarkMode">>;
}

export function Dashboard({ page: Page, children, sidebar, navbarProps }: DashboardProps) {
  // The Dashboard is intentionally minimal: it composes PanelGroup/Panel/PanelResizeHandle
  // and exposes slots for `Navbar`, `Sidebar` and main content.
  const toggle = typeof navbarProps?.toggleDarkMode === 'function' ? navbarProps.toggleDarkMode : () => {};
  const isDark = navbarProps?.isDarkMode ?? false;

  return (
    <>
      <Header />
      <Navbar isDarkMode={isDark} toggleDarkMode={toggle} brand={navbarProps?.brand} />

      <Block component="main" data-role="dash-main" relative="" w="full" data-class="main">
        <PanelGroup direction="horizontal" autoSaveId="dashlayout-panels">
          <Panel defaultSize={20} minSize={10} maxSize={40} data-class="sidebar-panel">
            <Sidebar>{sidebar}</Sidebar>
          </Panel>

          <PanelResizeHandle data-class="sidebar-resize-handle" />

          <Panel defaultSize={80} minSize={50}>
            <Box p="4" bg="muted" data-class="main-content-box">
              <Container data-class="main-content-container">{Page ? <Page /> : children}</Container>
            </Box>
          </Panel>
        </PanelGroup>
      </Block>
      <Footer />
    </>
  );
}

// Default export: factory alias
export function DashLayout(props: DashboardProps) {
  return <Dashboard {...props} />;
}


