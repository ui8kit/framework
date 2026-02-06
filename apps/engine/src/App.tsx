import { Routes, Route, Link } from 'react-router-dom';
import { WebsitePage } from './routes/WebsitePage';
import { DashboardPage } from './routes/DashboardPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<WebsitePage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
    </Routes>
  );
}
