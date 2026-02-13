import { Routes, Route } from 'react-router-dom';
import { WebsitePage } from '@/routes/website/WebsitePage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<WebsitePage />} />
    </Routes>
  );
}
