import { DashSidebar } from '@/blocks';
import { context } from '@ui8kit/data';
import { DashboardPageView } from './views/DashboardPageView';

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
