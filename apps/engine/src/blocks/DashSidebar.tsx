import { Link } from 'react-router-dom';
import { Stack, Text } from '@ui8kit/core';

export type DashSidebarLink = {
  label: string;
  href: string;
  active?: boolean;
};

export type DashSidebarProps = {
  label?: string;
  links?: DashSidebarLink[];
  'data-class'?: string;
};

/**
 * Dashboard sidebar navigation block.
 * Pure presentational: label and links from props. Static prototype defaults.
 */
export function DashSidebar({
  label = 'Navigation',
  links = [
    { label: 'Website', href: '/', active: false },
    { label: 'Dashboard', href: '/dashboard', active: true },
  ],
  'data-class': dataClass,
}: DashSidebarProps) {
  return (
    <Stack gap="2" p="4" data-class={dataClass ?? 'dash-sidebar-nav'}>
      <Text
        fontSize="xs"
        fontWeight="semibold"
        textColor="muted-foreground"
        data-class="dash-sidebar-label"
      >
        {label}
      </Text>
      {links.map((link) => (
        <Link
          key={link.href}
          to={link.href}
          className={
            link.active
              ? 'text-sm px-2 py-1 rounded bg-accent font-medium'
              : 'text-sm px-2 py-1 rounded hover:bg-accent'
          }
          data-class="dash-sidebar-link"
        >
          {link.label}
        </Link>
      ))}
    </Stack>
  );
}
