import type { ReactNode } from 'react';
import { DashLayout } from '@/layouts';
import { DashboardBlock } from '@ui8kit/blocks';
import { Stack } from '@ui8kit/core';

interface DashboardPageViewProps {
  sidebar: ReactNode;
  dashboard: any;
}

export function DashboardPageView(props: DashboardPageViewProps) {
  const { sidebar, dashboard } = props;

  return (
    <DashLayout sidebar={sidebar}>
      <Stack gap="6" data-class="dashboard-content">
        <DashboardBlock {...dashboard} />
      </Stack>
    </DashLayout>
  );
}
