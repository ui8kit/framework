import { Routes, Route } from 'react-router-dom';
import { WebsitePage } from '@/routes/website/WebsitePage';
import { BlogPage } from '@/routes/website/BlogPage';
import { ShowcasePage } from '@/routes/website/ShowcasePage';
import { AdminPage } from '@/routes/website/AdminPage';
import { context } from '@ui8kit/data';

const WEBSITE_PATH = context.page.website.find((p) => p.id === 'website-home')?.path ?? '/';
const BLOG_PATH = context.page.website.find((p) => p.id === 'website-blog')?.path ?? '/blog';
const SHOWCASE_PATH =
  context.page.website.find((p) => p.id === 'website-showcase')?.path ?? '/showcase';
const ADMIN_PATH = context.page.website.find((p) => p.id === 'website-admin')?.path ?? '/admin';

export function App() {
  return (
    <Routes>
      <Route path={WEBSITE_PATH} element={<WebsitePage />} />
      <Route path={BLOG_PATH} element={<BlogPage />} />
      <Route path={SHOWCASE_PATH} element={<ShowcasePage />} />
      <Route path={ADMIN_PATH} element={<AdminPage />} />
    </Routes>
  );
}
