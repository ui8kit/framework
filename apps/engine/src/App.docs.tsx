import { Routes, Route } from 'react-router-dom';
import { DocsPage } from '@/routes/docs/DocsPage';
import { DocsComponentsPage } from '@/routes/docs/DocsComponentsPage';
import { DocsInstallationPage } from '@/routes/docs/DocsInstallationPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DocsPage />} />
      <Route path="/components" element={<DocsComponentsPage />} />
      <Route path="/installation" element={<DocsInstallationPage />} />
    </Routes>
  );
}
