import { DashLayout } from '@/layouts';
import { DashSidebar } from '@/blocks';
import { DashboardBlock } from '@ui8kit/blocks';
import { context } from '@ui8kit/data';
import { Stack } from '@ui8kit/core';

/**
 * Dashboard Page — DashLayout showcase.
 * Props-only: data from context (static prototype).
 */
export function DashboardPage() {
  return (
    <DashLayout
      sidebar={<DashSidebar label="Navigation" links={context.dashboardSidebarLinks} />}
    >
      <Stack gap="6" data-class="dashboard-content">
        <DashboardBlock {...context.dashboard} />
      </Stack>
    </DashLayout>
  );
}
