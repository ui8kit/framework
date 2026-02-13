import type { ComponentProps } from 'react';
import { DashLayoutView } from './views/DashLayoutView';

export type DashLayoutProps = ComponentProps<typeof DashLayoutView>;

export function DashLayout(props: DashLayoutProps) {
  return <DashLayoutView {...props} />;
}
