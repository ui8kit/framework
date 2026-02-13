import type { ComponentProps } from 'react';
import { MainLayoutView } from './views/MainLayoutView';

export type MainLayoutProps = ComponentProps<typeof MainLayoutView>;

export function MainLayout(props: MainLayoutProps) {
  return <MainLayoutView {...props} />;
}
