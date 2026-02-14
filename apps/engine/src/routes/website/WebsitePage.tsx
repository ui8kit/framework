import { WebsitePageView } from '@/blocks';
import { context } from '@ui8kit/data';

/**
 * Home Page container — resolves context.
 */
export function WebsitePage() {
  return (
    <WebsitePageView
      mode="full"
      navItems={context.navItems}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
      hero={context.hero}
      valueProposition={context.valueProposition}
    />
  );
}
