import { Link } from 'react-router-dom';
import { Stack, Text } from '@ui8kit/core';

export type SidebarLink = {
  label: string;
  href: string;
};

export type SidebarContentProps = {
  title?: string;
  links?: SidebarLink[];
  'data-class'?: string;
};

/**
 * Sidebar content block for website layout.
 * Pure presentational: title and links from props. Static prototype defaults.
 */
export function SidebarContent({
  title = 'Quick Links',
  links = [
    { label: 'Home', href: '/' },
    { label: 'Dashboard', href: '/dashboard' },
  ],
  'data-class': dataClass,
}: SidebarContentProps) {
  return (
    <Stack gap="4" data-class={dataClass ?? 'sidebar-widgets'}>
      <Stack component="nav" data-class="sidebar-widget">
        <Text component="h3" fontSize="sm" fontWeight="semibold" data-class="sidebar-widget-title">
          {title}
        </Text>
        <Stack gap="1" data-class="sidebar-links">
          {links.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-sm text-muted-foreground hover:text-foreground"
              data-class="sidebar-link"
            >
              {link.label}
            </Link>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
