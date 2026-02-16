import { MainLayout } from '@/layouts';
import { SidebarContent } from '@/blocks';
import { MenuBlock } from '@ui8kit/blocks';

export interface MenuPageViewProps {
  navItems?: { id: string; title: string; url: string }[];
  sidebar: React.ReactNode;
  headerTitle?: string;
  headerSubtitle?: string;
  menu: { title?: string; subtitle?: string; dishes?: { id: string; title: string; description: string; price: string; category: string }[] };
}

/**
 * Menu Page view — Dish cards grid.
 */
export function MenuPageView({
  navItems,
  sidebar,
  headerTitle,
  headerSubtitle,
  menu,
}: MenuPageViewProps) {
  return (
    <MainLayout
      mode="full"
      navItems={navItems}
      sidebar={sidebar}
      headerTitle={headerTitle}
      headerSubtitle={headerSubtitle}
    >
      <MenuBlock title={menu.title} subtitle={menu.subtitle} dishes={menu.dishes} />
    </MainLayout>
  );
}
