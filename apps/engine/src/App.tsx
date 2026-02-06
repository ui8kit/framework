import { Routes, Route, Link } from 'react-router-dom';
import { WebsitePage } from './pages/WebsitePage';
import { DashboardPage } from './pages/DashboardPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<WebsitePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}
