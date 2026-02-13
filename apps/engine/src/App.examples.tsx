import { Routes, Route, Navigate } from 'react-router-dom';
import { ExamplesLayout } from '@/layouts/ExamplesLayout';
import { ExamplesPage } from '@/routes/ExamplesPage';
import { ExamplesDashboardPage } from '@/routes/ExamplesDashboardPage';
import { ExamplesTasksPage } from '@/routes/ExamplesTasksPage';
import { ExamplesPlaygroundPage } from '@/routes/ExamplesPlaygroundPage';
import { ExamplesAuthPage } from '@/routes/ExamplesAuthPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<ExamplesLayout />}>
        <Route index element={<ExamplesPage />} />
        <Route path="dashboard" element={<ExamplesDashboardPage />} />
        <Route path="tasks" element={<ExamplesTasksPage />} />
        <Route path="playground" element={<ExamplesPlaygroundPage />} />
        <Route path="authentication" element={<ExamplesAuthPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
