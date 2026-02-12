import { Outlet, useLocation } from 'react-router-dom';
import { context } from '@ui8kit/data';
import { ExamplesLayoutView } from './views/ExamplesLayoutView';

/**
 * Examples layout container — resolves context/router data.
 */
export function ExamplesLayout() {
  const location = useLocation();
  const tabs = context.getExamplesSidebarLinks(location.pathname);

  return (
    <ExamplesLayoutView
      navItems={context.navItems}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
      hero={context.hero}
      examples={context.examples}
      tabs={tabs}
    >
      <Outlet />
    </ExamplesLayoutView>
  );
}
