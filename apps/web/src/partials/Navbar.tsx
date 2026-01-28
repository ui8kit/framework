import { useState } from "react";
import { Atom, Menu, Moon, Sun } from "lucide-react";
import { Block, Button, Group, Icon, Text } from "@ui8kit/core";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
];

export interface NavbarProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  brand?: string;
}

export function Navbar({ isDarkMode, toggleDarkMode, brand = "App" }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      <Block component="nav" bg="card" p="4" data-role="dash-navbar" data-class="navbar">
        <Group justify="between" items="center" data-class="navbar-group">
          <Group gap="2" items="center" data-class="navbar-brand-group">
            <Icon component="span" lucideIcon={Atom} bg="primary" />
            <Text font="bold">{brand}</Text>
          </Group>

          <Group gap="6" items="center" data-class="navbar-right">
            {/* Desktop Navigation - moved to right side */}
            <Group gap="6" className="hidden md:flex" data-class="navbar-nav">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm text-primary inline"
                  data-class="navbar-nav-link"
                >
                  {item.label}
                </a>
              ))}
            </Group>

            {/* Action Buttons */}
            <Group gap="2" items="center" data-class="navbar-actions">
              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                title="Menu"
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden"
                data-class="mobile-menu-button"
              >
                <Icon component="span" lucideIcon={Menu} />
              </Button>

              <Button
                variant="ghost"
                title="Toggle dark mode"
                onClick={toggleDarkMode}
                data-toggle-dark
                data-class="dark-mode-button"
              >
                <Icon component="span" lucideIcon={isDarkMode ? Sun : Moon} />
                <Text text="sm">Theme</Text>
              </Button>
            </Group>
          </Group>
        </Group>
      </Block>

      {/* Mobile Navigation Menu */}
      <div className="relative">
        <input
          id="mobile-nav-toggle"
          type="checkbox"
          checked={isMobileMenuOpen}
          onChange={(e) => setIsMobileMenuOpen(e.target.checked)}
          className="hidden"
        />
        <div className="fixed inset-0 z-50 hidden peer-checked:block" style={{ display: isMobileMenuOpen ? 'block' : 'none' }}>
          <label
            htmlFor="mobile-nav-toggle"
            className="absolute inset-0 bg-card/50 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-64 max-w-full p-4 bg-card border-l border-border">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">Navigation</span>
              <label
                htmlFor="mobile-nav-toggle"
                className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-border text-muted-foreground cursor-pointer"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                ✕
              </label>
            </div>
            <Group gap="4" flex="col" data-class="mobile-nav-content">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm text-primary block py-2 px-4 rounded hover:bg-muted"
                  onClick={() => setIsMobileMenuOpen(false)}
                  data-class="mobile-nav-link"
                >
                  {item.label}
                </a>
              ))}
            </Group>
          </div>
        </div>
      </div>
    </>
  );
}

