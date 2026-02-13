import { Routes, Route } from 'react-router-dom';
import { DocsPage } from '@/routes/DocsPage';
import { DocsComponentsPage } from '@/routes/DocsComponentsPage';
import { DocsInstallationPage } from '@/routes/DocsInstallationPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DocsPage />} />
      <Route path="/components" element={<DocsComponentsPage />} />
      <Route path="/installation" element={<DocsInstallationPage />} />
    </Routes>
  );
}
