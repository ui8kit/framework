import { DashSidebar, DashboardPageView } from '@/blocks';
import { context } from '@ui8kit/data';

/**
 * Dashboard Page — DashLayout showcase.
 * Props-only: data from context (static prototype).
 */
export function DashboardPage() {
  return (
    <DashboardPageView
      sidebar={<DashSidebar label="Navigation" links={context.dashboardSidebarLinks} />}
      dashboard={context.dashboard}
    />
  );
}
