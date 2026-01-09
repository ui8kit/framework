import { Atom, Moon, Sun } from "lucide-react";
import { Block, Button, Group, Icon, Text } from "@ui8kit/core";

export interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  brand?: string;
}

export function Navbar({ isDarkMode, toggleDarkMode, brand = "App" }: NavbarProps) {
  return (
    <Block component="nav" bg="card" p="4" data-role="dash-navbar" data-class="navbar">
      <Group justify="between" items="center" data-class="navbar-group">
        <Group gap="2" items="center" data-class="navbar-brand-group">
          <Icon component="span" lucideIcon={Atom} bg="primary" />
          <Text font="bold">{brand}</Text>
        </Group>

        <Button
          variant="ghost"
          title="Toggle dark mode"
          onClick={toggleDarkMode}
          data-class="navbar-toggle-dark-mode-button"
        >
          <Icon component="span" lucideIcon={isDarkMode ? Sun : Moon} />
          <Text text="sm">Theme</Text>
        </Button>
      </Group>
    </Block>
  );
}

