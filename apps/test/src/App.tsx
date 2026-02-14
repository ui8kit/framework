import { Routes, Route, Navigate } from 'react-router-dom';
import { WebsitePage } from '@/routes/WebsitePage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<WebsitePage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
