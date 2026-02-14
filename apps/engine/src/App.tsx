import { Routes, Route } from 'react-router-dom';
import { WebsitePage } from '@/routes/website/WebsitePage';
import { ComponentsPage } from '@/routes/website/ComponentsPage';
import { GuidesPage } from '@/routes/website/GuidesPage';
import { GuideDetailPage } from '@/routes/website/GuideDetailPage';
import { BlogPage } from '@/routes/website/BlogPage';
import { BlogDetailPage } from '@/routes/website/BlogDetailPage';
import { ShowcasePage } from '@/routes/website/ShowcasePage';
import { AdminLoginPage } from '@/routes/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/routes/admin/AdminDashboardPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<WebsitePage />} />
      <Route path="/components" element={<ComponentsPage />} />
      <Route path="/guides" element={<GuidesPage />} />
      <Route path="/guides/:slug" element={<GuideDetailPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogDetailPage />} />
      <Route path="/showcase" element={<ShowcasePage />} />
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
    </Routes>
  );
}
