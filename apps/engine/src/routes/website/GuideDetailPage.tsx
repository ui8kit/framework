import { useParams } from 'react-router-dom';
import { SidebarContent, GuideDetailPageView } from '@/blocks';
import { context } from '@/data/context';

export function GuideDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const guide = context.guides.guides?.find((r: { slug?: string }) => r.slug === slug);

  return (
    <GuideDetailPageView
      navItems={context.navItems}
      sidebar={<SidebarContent title="Quick Links" links={context.sidebarLinks} />}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
      guide={guide}
    />
  );
}
