import { ShowcasePageView } from '@/blocks';
import { context } from '@ui8kit/data';

/**
 * Showcase Page container — resolves context.
 */
export function ShowcasePage() {
  return (
    <ShowcasePageView
      navItems={context.navItems}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
      showcase={context.showcase}
    />
  );
}
