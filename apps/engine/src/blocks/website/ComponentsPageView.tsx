import { MainLayout } from '@/layouts';
import { SidebarContent } from '@/blocks';
import { ComponentsBlock } from '@ui8kit/blocks';

export interface ComponentsPageViewProps {
  navItems?: { id: string; title: string; url: string }[];
  sidebar: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  components: { title?: string; subtitle?: string; items?: { id: string; title: string; description: string; price: string; category: string }[] };
}

/**
 * Components Page view — Component cards grid.
 */
export function ComponentsPageView({
  navItems,
  sidebar,
  headerTitle,
  headerSubtitle,
  components,
}: ComponentsPageViewProps) {
  return (
    <MainLayout
      mode="full"
      navItems={navItems}
      sidebar={sidebar}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      <ComponentsBlock title={components.title} subtitle={components.subtitle} items={components.items} />
    </MainLayout>
  );
}
