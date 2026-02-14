import { DashSidebar, DashboardPageView } from '@/blocks';
import { context } from '@ui8kit/data';

export function DashboardPage() {
  return (
    <DashboardPageView
      sidebar={<DashSidebar label="Navigation" links={context.dashboardSidebarLinks} />}
      dashboard={context.dashboard}
    />
  );
}
