import { Block, Container, Group, Button, Text } from '@ui8kit/core';
import { If, Var, Loop } from '@ui8kit/template';

export type NavItem = {
  id: string;
  title: string;
  url: string;
};

export type HeaderProps = {
  title?: string;
  subtitle?: string;
  navItems?: NavItem[];
  dataClass?: string;
  'data-class'?: string;
};

export function Header({
  title,
  subtitle,
  navItems,
  dataClass,
  'data-class': dataClassAttr,
}: HeaderProps) {
  return (
    <Block
      component="header"
      py="4"
      bg="background"
      border="b"
      shadow="sm"
      data-class={dataClass ?? dataClassAttr ?? 'header'}
    >
      <Container
        max="w-6xl"
        mx="auto"
        px="4"
        flex=""
        justify="between"
        items="center"
        gap="8"
        data-class="header-container"
      >
        {/* Brand */}
        <a href="/" data-class="header-brand">
          <Group component="span" gap="2" items="center" data-class="header-brand-content">
            <If test="title" value={!!(title ?? '')}>
              <Text
                fontSize="xl"
                fontWeight="bold"
                textColor="primary"
                data-class="header-brand-title"
              >
                <Var name="title" value={title ?? 'UI8Kit'} />
              </Text>
            </If>
            <If test="subtitle" value={!!(subtitle ?? 'Design System')}>
              <Text
                fontSize="sm"
                textColor="muted-foreground"
                data-class="header-brand-subtitle"
              >
                <Var name="subtitle" value={subtitle ?? 'Design System'} />
              </Text>
            </If>
          </Group>
        </a>

        {/* Navigation */}
        <If test="navItems" value={(navItems ?? []).length > 0}>
          <Block component="nav" flex="" gap="2" items="center" data-class="header-nav">
            <Loop each="navItems" as="item" data={navItems ?? []}>
              {(item: NavItem) => (
                <Button
                  variant="ghost"
                  size="sm"
                  href={item.url}
                  data-class="header-nav-item"
                >
                  <Text component="span">
                    <Var name="item.title" value={item.title} />
                  </Text>
                </Button>
              )}
            </Loop>
          </Block>
        </If>
      </Container>
    </Block>
  );
}
