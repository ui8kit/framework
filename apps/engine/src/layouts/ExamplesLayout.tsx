import { useMemo } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { context } from '@ui8kit/data';
import {
  ExamplesPageView,
  ExamplesDashboardPageView,
  ExamplesTasksPageView,
  ExamplesPlaygroundPageView,
  ExamplesAuthPageView,
} from '@/blocks';
import { ExamplesLayoutView } from './views/ExamplesLayoutView';

/**
 * Examples layout container — resolves context/router data.
 */
export function ExamplesLayout() {
  const location = useLocation();
  const { examplePage } = useParams<{ examplePage?: string }>();
  const examplesRootPath =
    context.page.examples.find((entry) => entry.id === 'examples-layout')?.path ?? '/examples';
  const tabs = useMemo(
    () => context.getExamplesSidebarLinks(location.pathname),
    [location.pathname]
  );
  const activeView = useMemo(() => {
    switch (examplePage) {
      case undefined:
        return <ExamplesPageView />;
      case 'dashboard':
        return <ExamplesDashboardPageView />;
      case 'tasks':
        return <ExamplesTasksPageView />;
      case 'playground':
        return <ExamplesPlaygroundPageView />;
      case 'authentication':
        return <ExamplesAuthPageView />;
      default:
        return <Navigate to={examplesRootPath} replace />;
    }
  }, [examplePage, examplesRootPath]);

  return (
    <ExamplesLayoutView
      navItems={context.navItems}
      headerTitle={context.site.title}
      headerSubtitle={context.site.subtitle}
      hero={context.hero}
      examples={context.examples}
      tabs={tabs}
    >
      {activeView}
    </ExamplesLayoutView>
  );
}
