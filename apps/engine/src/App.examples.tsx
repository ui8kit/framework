import { Routes, Route, Navigate } from 'react-router-dom';
import { ExamplesLayout } from '@/layouts/ExamplesLayout';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<ExamplesLayout />} />
      <Route path="/:examplePage" element={<ExamplesLayout />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
