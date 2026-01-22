import { Block, Box, Container, Group, Text } from "@ui8kit/core";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export function Header({ name = "UI8Kit" }: { name?: string }) {
  return (
    <Block
      component="header"
      className="border-b bg-card"
      data-class="site-header"
    >
      <Container className="container mx-auto px-4 py-4" data-class="site-header-container">
        <Group justify="between" items="center" data-class="site-header-row">
          <Group gap="2" items="center" data-class="site-header-brand">
            <Box
              w="8"
              h="8"
              rounded="full"
              bg="primary"
              data-class="site-header-brand-icon"
            />
            <Text font="bold" text="lg" data-class="site-header-brand-name">
              {name}
            </Text>
          </Group>

          <Group gap="6" data-class="site-header-nav">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-sm text-primary inline"
                data-class="site-header-nav-link"
              >
                {item.label}
              </a>
            ))}
          </Group>
        </Group>
      </Container>
    </Block>
  );
}
