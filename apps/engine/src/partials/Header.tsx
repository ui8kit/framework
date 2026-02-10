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
  'data-class'?: string;
};

export function Header({
  title = 'UI8Kit',
  subtitle = 'Design System',
  navItems = [],
  'data-class': dataClass,
}: HeaderProps) {
  return (
    <Block
      component="header"
      py="4"
      bg="background"
      border=""
      shadow="sm"
      data-class={dataClass || 'header'}
    >
      <Container max="w-6xl" mx="auto" px="4" data-class="header-container">
        <Group justify="between" items="center" gap="8" data-class="header-content">
          {/* Brand */}
          <a href="/" data-class="header-brand">
            <Group gap="2" items="center" data-class="header-brand-content">
              <Text
                fontSize="xl"
                fontWeight="bold"
                textColor="primary"
                data-class="header-brand-title"
              >
                <Var name="title" value={title} />
              </Text>
              <If test="subtitle" value={!!subtitle}>
                <Text
                  fontSize="sm"
                  textColor="muted-foreground"
                  data-class="header-brand-subtitle"
                >
                  <Var name="subtitle" value={subtitle} />
                </Text>
              </If>
            </Group>
          </a>

          {/* Navigation */}
          <Group gap="4" items="center" data-class="header-right-section">
            <If test="navItems" value={navItems.length > 0}>
              <Block component="nav" data-class="header-nav">
                <Group gap="2" items="center" data-class="header-nav-group">
                  <Loop each="navItems" as="item" data={navItems}>
                    {(item: NavItem) => (
                      <Button
                        variant="ghost"
                        size="sm"
                        href={item.url}
                        data-class="header-nav-item"
                      >
                        <Var name="item.title" value={item.title} />
                      </Button>
                    )}
                  </Loop>
                </Group>
              </Block>
            </If>
          </Group>
        </Group>
      </Container>
    </Block>
  );
}
