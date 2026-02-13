import { Block, Stack } from '@ui8kit/core';
import { ReactNode } from 'react';

interface SidebarProps {
  children: ReactNode;
  position?: 'left' | 'right';
}

export function Sidebar(props: SidebarProps) {
  const { children, position } = props;

  return (
    <Block component="aside" data-class={`sidebar sidebar-${position}`}>
      <Stack gap="6" data-class="sidebar-content">
        {children}
      </Stack>
    </Block>
  );
}
