import { Routes, Route } from 'react-router-dom';
import { DashboardPage } from '@/routes/dashboard/DashboardPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
    </Routes>
  );
}
