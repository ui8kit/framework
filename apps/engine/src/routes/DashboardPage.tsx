import { Link } from 'react-router-dom';
import { DashLayout } from '@/layouts';
import { DashboardBlock } from '@ui8kit/blocks';
import { fixtures } from '@ui8kit/data';
import { Stack, Text, Button } from '@ui8kit/core';

// Sidebar navigation for dashboard
const DashSidebar = () => (
  <Stack gap="2" p="4" data-class="dash-sidebar-nav">
    <Text fontSize="xs" fontWeight="semibold" textColor="muted-foreground" data-class="dash-sidebar-label">
      Navigation
    </Text>
    <Link to="/" className="text-sm px-2 py-1 rounded hover:bg-accent">
      Website
    </Link>
    <Link to="/dashboard" className="text-sm px-2 py-1 rounded bg-accent font-medium">
      Dashboard
    </Link>
  </Stack>
);

/**
 * Dashboard Page — DashLayout showcase
 *
 * Demonstrates: dashboard layout with fixed sidebar, admin panels
 */
export function DashboardPage() {
  return (
    <DashLayout sidebar={<DashSidebar />}>
      <Stack gap="6" data-class="dashboard-content">
        <DashboardBlock {...fixtures.dashboard} />
      </Stack>
    </DashLayout>
  );
}
