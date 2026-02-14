import { Block, Container, Group, Text } from '@ui8kit/core';
import { DomainNavButton } from './DomainNavButton';
import { Fragment } from 'react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  navItems?: any[];
  dataClass?: string;
  dataClassAttr?: string;
}

export function Header(props: HeaderProps) {
  const { title, subtitle, navItems, dataClass, dataClassAttr } = props;

  return (
    <Block component="header" py="4" bg="background" border="b" shadow="sm" data-class={dataClass ?? dataClassAttr ?? 'header'}>
      <Container max="w-6xl" mx="auto" px="4" flex="" justify="between" items="center" gap="8" data-class="header-container">
        <a href="/" data-class="header-brand">
          <Group component="span" gap="2" items="center" data-class="header-brand-content">
            {title ? (<><Text fontSize="xl" fontWeight="bold" textColor="primary" data-class="header-brand-title">{title}</Text></>) : null}
            {subtitle ? (<><Text fontSize="sm" textColor="muted-foreground" data-class="header-brand-subtitle">{subtitle}</Text></>) : null}
          </Group>
        </a>
        {navItems ? (<><Block component="nav" flex="" gap="2" items="center" data-class="header-nav">{navItems.map((item, index) => (
        <Fragment key={item.id ?? index}>
        <DomainNavButton variant={"ghost"} size={"sm"} href={item.url} data-class={"header-nav-item"}><Text component="span">{item.title}</Text></DomainNavButton>
        </Fragment>
        ))}</Block></>) : null}
      </Container>
    </Block>
  );
}
