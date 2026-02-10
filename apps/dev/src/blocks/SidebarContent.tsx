import React from 'react';
import { Link } from 'react-router-dom';
import { Stack, Text } from '@ui8kit/core';

interface SidebarContentProps {
  title?: string;
  links?: any[];
  dataClass?: string;
}

export function SidebarContent(props: SidebarContentProps) {
  const { title, links, dataClass } = props;
  return (
    <Stack gap="4" data-class={dataClass ?? 'sidebar-widgets'}>
      <Stack component="nav" data-class="sidebar-widget">
        <Text component="h3" fontSize="sm" fontWeight="semibold" data-class="sidebar-widget-title">
          {title}
        </Text>
        <Stack gap="1" data-class="sidebar-links">
          {links.map((link, index) => (
          <React.Fragment key={link.href}>
          <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground" data-class="sidebar-link">{link.label}</Link>
          </React.Fragment>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
