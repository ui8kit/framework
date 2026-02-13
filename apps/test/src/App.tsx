import { Routes, Route, Navigate } from 'react-router-dom';
import { DocsComponentsPage } from '@/routes/DocsComponentsPage';
import { DocsInstallationPage } from '@/routes/DocsInstallationPage';
import { DocsPage } from '@/routes/DocsPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DocsPage />} />
      <Route path="/components" element={<DocsComponentsPage />} />
      <Route path="/installation" element={<DocsInstallationPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
