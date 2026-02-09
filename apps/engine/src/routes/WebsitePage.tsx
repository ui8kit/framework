import { MainLayout } from '@/layouts';
import { SidebarContent } from '@/blocks';
import { HeroBlock, FeaturesBlock, CTABlock, PricingBlock, TestimonialsBlock } from '@ui8kit/blocks';
import { context } from '@ui8kit/data';

/**
 * Website Page — MainLayout showcase.
 * Props-only: all data from context (static prototype).
 */
export function WebsitePage() {
  return (
    <MainLayout
      mode="full"
      navItems={context.navItems}
      sidebar={<SidebarContent title="Quick Links" links={context.sidebarLinks} />}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
    >
      <HeroBlock {...context.hero} />
      <FeaturesBlock {...context.features} />
      <CTABlock {...context.cta} />
      <PricingBlock {...context.pricing} />
      <TestimonialsBlock {...context.testimonials} />
    </MainLayout>
  );
}
