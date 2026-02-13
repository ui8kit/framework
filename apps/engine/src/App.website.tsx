import { Routes, Route } from 'react-router-dom';
import { WebsitePage } from '@/routes/WebsitePage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<WebsitePage />} />
    </Routes>
  );
}
