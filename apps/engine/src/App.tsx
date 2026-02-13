import { Routes, Route, Navigate } from 'react-router-dom';
import { WebsitePage } from '@/routes/WebsitePage';
import { DashboardPage } from '@/routes/DashboardPage';
import { DocsPage } from '@/routes/DocsPage';
import { DocsComponentsPage } from '@/routes/DocsComponentsPage';
import { DocsInstallationPage } from '@/routes/DocsInstallationPage';
import { ExamplesLayout } from '@/layouts/ExamplesLayout';
import { ExamplesPage } from '@/routes/ExamplesPage';
import { ExamplesDashboardPage } from '@/routes/ExamplesDashboardPage';
import { ExamplesTasksPage } from '@/routes/ExamplesTasksPage';
import { ExamplesPlaygroundPage } from '@/routes/ExamplesPlaygroundPage';
import { ExamplesAuthPage } from '@/routes/ExamplesAuthPage';
import { context } from '@ui8kit/data';

const WEBSITE_PATH = context.page.website[0]?.path ?? '/';
const DASHBOARD_PATH = context.page.dashboard[0]?.path ?? '/dashboard';
const DOCS_PATH = context.page.docs.find((entry) => entry.id === 'docs-introduction')?.path ?? '/docs';
const DOCS_COMPONENTS_PATH =
  context.page.docs.find((entry) => entry.id === 'docs-components')?.path ?? '/docs/components';
const DOCS_INSTALLATION_PATH =
  context.page.docs.find((entry) => entry.id === 'docs-installation')?.path ?? '/docs/installation';
const EXAMPLES_ROOT_PATH = context.page.examples.find((entry) => entry.id === 'examples-layout')?.path ?? '/examples';

export function App() {
  return (
    <Routes>
      <Route path={WEBSITE_PATH} element={<WebsitePage />} />
      <Route path={DASHBOARD_PATH} element={<DashboardPage />} />
      <Route path={DOCS_PATH} element={<DocsPage />} />
      <Route path={DOCS_COMPONENTS_PATH} element={<DocsComponentsPage />} />
      <Route path={DOCS_INSTALLATION_PATH} element={<DocsInstallationPage />} />

      {/* Examples section (nested routes, same Hero + Outlet) */}
      <Route path={EXAMPLES_ROOT_PATH} element={<ExamplesLayout />}>
        <Route index element={<ExamplesPage />} />
        <Route path="dashboard" element={<ExamplesDashboardPage />} />
        <Route path="tasks" element={<ExamplesTasksPage />} />
        <Route path="playground" element={<ExamplesPlaygroundPage />} />
        <Route path="authentication" element={<ExamplesAuthPage />} />
        <Route path="*" element={<Navigate to={EXAMPLES_ROOT_PATH} replace />} />
      </Route>
    </Routes>
  );
}
