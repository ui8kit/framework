/**
 * Layout - Example with Extends and Block
 */

import { Block, Container, Title, Text } from '@ui8kit/core';
import { Extends, DefineBlock, Var, Slot } from '@ui8kit/template';

interface LayoutProps {
  title?: string;
  children?: React.ReactNode;
}

export function Layout({ title, children }: LayoutProps) {
  return (
    <>
      <Extends layout="base" />

      <DefineBlock name="title">
        <Var name="title" default="My App" value={title} />
      </DefineBlock>

      <Block component="div" min="h-screen" bg="muted" data-class="layout-root">
        <Block component="header" bg="background" shadow="sm" data-class="layout-header">
          <Container max="w-7xl" px="4" py="8" data-class="layout-header-inner">
            <Title fontSize="2xl" fontWeight="bold" textColor="foreground" data-class="layout-title">
              <Var name="title" default="My App" value={title} />
            </Title>
          </Container>
        </Block>

        <Block component="main" data-class="layout-main">
          <Container max="w-7xl" px="4" py="8" data-class="layout-content">
            <DefineBlock name="content">
              <Slot name="content">{children}</Slot>
            </DefineBlock>
          </Container>
        </Block>

        <Block component="footer" bg="card" py="8" data-class="layout-footer">
          <Container max="w-7xl" data-class="layout-footer-inner">
            <DefineBlock name="footer">
              <Text textAlign="center" textColor="muted-foreground" data-class="layout-footer-text">
                &copy; 2025 My App. All rights reserved.
              </Text>
            </DefineBlock>
          </Container>
        </Block>
      </Block>
    </>
  );
}
