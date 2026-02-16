import { Routes, Route } from 'react-router-dom';
import { WebsitePage } from '@/routes/website/WebsitePage';
import { MenuPage } from '@/routes/website/MenuPage';
import { RecipesPage } from '@/routes/website/RecipesPage';
import { RecipeDetailPage } from '@/routes/website/RecipeDetailPage';
import { BlogPage } from '@/routes/website/BlogPage';
import { BlogDetailPage } from '@/routes/website/BlogDetailPage';
import { PromotionsPage } from '@/routes/website/PromotionsPage';
import { AdminLoginPage } from '@/routes/admin/AdminLoginPage';
import { AdminDashboardPage } from '@/routes/admin/AdminDashboardPage';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<WebsitePage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/recipes" element={<RecipesPage />} />
      <Route path="/recipes/:slug" element={<RecipeDetailPage />} />
      <Route path="/blog" element={<BlogPage />} />
      <Route path="/blog/:slug" element={<BlogDetailPage />} />
      <Route path="/promotions" element={<PromotionsPage />} />
      <Route path="/admin" element={<AdminLoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
    </Routes>
  );
}
