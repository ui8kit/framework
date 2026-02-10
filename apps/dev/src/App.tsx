import { Routes, Route } from 'react-router-dom';
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
import { Navigate } from 'react-router-dom';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<WebsitePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/docs" element={<DocsPage />} />
      <Route path="/docs/components" element={<DocsComponentsPage />} />
      <Route path="/docs/installation" element={<DocsInstallationPage />} />

      {/* Examples section (nested routes, same Hero + Outlet) */}
      <Route path="/examples" element={<ExamplesLayout />}>
        <Route index element={<ExamplesPage />} />
        <Route path="dashboard" element={<ExamplesDashboardPage />} />
        <Route path="tasks" element={<ExamplesTasksPage />} />
        <Route path="playground" element={<ExamplesPlaygroundPage />} />
        <Route path="authentication" element={<ExamplesAuthPage />} />
        <Route path="*" element={<Navigate to="/examples" replace />} />
      </Route>
    </Routes>
  );
}
