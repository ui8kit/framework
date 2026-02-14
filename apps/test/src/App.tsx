import { Routes, Route, Navigate } from 'react-router-dom';
import { DashboardPage } from '@/routes/DashboardPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
