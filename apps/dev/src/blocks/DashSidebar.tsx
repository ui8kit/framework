import React from 'react';
import { Link } from 'react-router-dom';
import { Stack, Text } from '@ui8kit/core';

interface DashSidebarProps {
  label?: string;
  links?: any[];
  dataClass?: string;
}

export function DashSidebar(props: DashSidebarProps) {
  const { label, links, dataClass } = props;
  return (
    <Stack gap="2" p="4" data-class={dataClass ?? 'dash-sidebar-nav'}>
      <Text fontSize="xs" fontWeight="semibold" textColor="muted-foreground" data-class="dash-sidebar-label">
        {label}
      </Text>
      {links.map((link, index) => (
      <React.Fragment key={link.href}>
      <Link to={link.href} data-class="dash-sidebar-link">{link.label}</Link>
      </React.Fragment>
      ))}
    </Stack>
  );
}
