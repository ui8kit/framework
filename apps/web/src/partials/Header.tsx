import { Block, Container, Group, Button, Icon, Text } from '@ui8kit/core'
import { Link, useNavigate } from 'react-router-dom'
import { Sun, Moon, Menu } from 'lucide-react'
import { useTheme } from '@/providers/theme'
import { Sheet } from '@ui8kit/core'
import { SearchBar } from '@/components/SearchBar'

type NavItem = {
  id: string
  title: string
  url: string
}

type HeaderProps = {
  title?: string
  subtitle?: string
  navItems?: NavItem[]
}

export function Header({ 
  title = 'UI8Kit', 
  subtitle = 'Design System',
  navItems = []
}: HeaderProps) {
  const { toggleDarkMode, isDarkMode } = useTheme()
  const navigate = useNavigate()
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768

  return (
    <Block 
      component="header" 
      py="4" 
      bg="background" 
      border=""
      shadow="sm"
      data-class="header"
    >
      <Container max="w-6xl" mx="auto" px="4" data-class="header-container">
        <Group justify="between" items="center" gap="4" data-class="header-content">
          {/* Brand */}
          <Link to="/" data-class="header-brand">
            <Group gap="2" items="center" data-class="header-brand-content">
              <Text 
                fontSize="xl" 
                fontWeight="bold" 
                textColor="primary"
                data-class="header-brand-title"
              >
                {title}
              </Text>
              <Text 
                fontSize="sm" 
                textColor="muted-foreground"
                data-class="header-brand-subtitle"
              >
                {subtitle}
              </Text>
            </Group>
          </Link>

          {/* Desktop Navigation */}
          {!isMobile && navItems.length > 0 && (
            <Group gap="2" items="center" data-class="header-nav">
              {navItems.map(item => (
                <Button 
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(item.url)}
                  data-class="header-nav-item"
                >
                  {item.title}
                </Button>
              ))}
            </Group>
          )}

          {/* Theme Toggle & Mobile Menu */}
          <Group gap="2" items="center" data-class="header-controls">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              data-class="header-theme-toggle"
            >
              <Icon lucideIcon={isDarkMode ? Sun : Moon} size="md" />
            </Button>

            {isMobile && navItems.length > 0 && (
              <Sheet 
                id="header-menu-sheet" 
                side="left" 
                title="Menu"
                triggerIcon={Menu}
                data-class="header-mobile-menu"
              >
                <Group gap="2" flex="col" data-class="header-mobile-nav">
                  <SearchBar />
                  {navItems.map(item => (
                    <Button 
                      key={item.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate(item.url)}
                      data-class="header-mobile-nav-item"
                    >
                      {item.title}
                    </Button>
                  ))}
                </Group>
              </Sheet>
            )}
          </Group>
        </Group>
      </Container>
    </Block>
  )
}
