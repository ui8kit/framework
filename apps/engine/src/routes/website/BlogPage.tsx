import { BlogPageView } from '@/blocks';
import { context } from '@ui8kit/data';

/**
 * Blog Page container — resolves context.
 */
export function BlogPage() {
  return (
    <BlogPageView
      navItems={context.navItems}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
      blog={context.blog}
    />
  );
}
