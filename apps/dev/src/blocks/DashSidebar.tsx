import React from 'react';
import { Stack, Text, Button } from '@ui8kit/core';

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
      {links ? (<>{links.map((link, index) => (
      <React.Fragment key={link.id ?? index}>
      <Button href={link.href} size="sm" variant={link.active ? 'secondary' : 'ghost'} justify="start" data-class="dash-sidebar-link">{link.label}</Button>
      </React.Fragment>
      ))}</>) : null}
    </Stack>
  );
}
