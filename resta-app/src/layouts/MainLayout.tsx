import type { ReactNode } from 'react';
import { Block } from '@ui8kit/core';

export interface MainLayoutProps {
  children?: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <Block component="main" data-class="resta-main-layout">
      {children}
    </Block>
  );
}
