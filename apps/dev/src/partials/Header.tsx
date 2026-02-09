import React from 'react';
import { Block, Container, Group, Button, Text } from '@ui8kit/core';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  navItems?: any[];
  dataClass?: string;
}

export function Header(props: HeaderProps) {
  const { title, subtitle, navItems, dataClass } = props;
  return (
    <Block component="nav" py="4" bg="background" border="" shadow="sm" data-class={dataClass || "header"}>
      <Container max="w-6xl" mx="auto" px="4" data-class="header-container">
        <Group justify="between" items="center" gap="8" data-class="header-content">
          <a href="/" data-class="header-brand">
            <Group gap="2" items="center" data-class="header-brand-content">
              <Text fontSize="xl" fontWeight="bold" textColor="primary" data-class="header-brand-title">
                {title}
              </Text>
              {subtitle ? (<><Text fontSize="sm" textColor="muted-foreground" data-class="header-brand-subtitle">{subtitle}</Text></>) : null}
            </Group>
          </a>
          <Group gap="4" items="center" data-class="header-right-section">
            {navItems ? (<><Group gap="2" items="center" data-class="header-nav">{navItems.map((item, index) => (
            <React.Fragment key={item.id ?? index}>
            <Button variant="ghost" size="sm" href={item.url} data-class="header-nav-item">{item.title}</Button>
            </React.Fragment>
            ))}</Group></>) : null}
          </Group>
        </Group>
      </Container>
    </Block>
  );
}
