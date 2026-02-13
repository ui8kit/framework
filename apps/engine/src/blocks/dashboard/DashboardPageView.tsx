import type { ReactNode } from 'react';
import { DashLayout } from '@/layouts';
import { DashboardBlock } from '@ui8kit/blocks';
import { Stack } from '@ui8kit/core';

export interface DashboardPageViewProps {
  sidebar: ReactNode;
  dashboard: any;
}

/**
 * Dashboard Page view — props-only.
 */
export function DashboardPageView({ sidebar, dashboard }: DashboardPageViewProps) {
  return (
    <DashLayout sidebar={sidebar}>
      <Stack gap="6" data-class="dashboard-content">
        <DashboardBlock {...dashboard} />
      </Stack>
    </DashLayout>
  );
}
