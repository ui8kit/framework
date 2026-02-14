import { AdminPageView } from '@/blocks';
import { context } from '@ui8kit/data';

/**
 * Admin Page container — resolves context.
 */
export function AdminPage() {
  return (
    <AdminPageView
      navItems={context.navItems}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
    />
  );
}
