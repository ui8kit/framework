import { Block, Container, Group, Button, Text } from '@ui8kit/core';

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
      component="nav" 
      py="4" 
      bg="background" 
      border=""
      shadow="sm"
      data-class={dataClass || "header"}
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
                {title}
              </Text>
              {subtitle ? (
                <Text 
                  fontSize="sm" 
                  textColor="muted-foreground"
                  data-class="header-brand-subtitle"
                >
                  {subtitle}
                </Text>
              ) : null}
            </Group>
          </a>

          {/* Navigation */}
          <Group gap="4" items="center" data-class="header-right-section">
            {navItems.length > 0 ? (
              <Group gap="2" items="center" data-class="header-nav">
                {navItems.map((item) => (
                  <Button 
                    key={item.id}
                    variant="ghost"
                    size="sm"
                    href={item.url}
                    data-class="header-nav-item"
                  >
                    {item.title}
                  </Button>
                ))}
              </Group>
            ) : null}
          </Group>
        </Group>
      </Container>
    </Block>
  );
}
