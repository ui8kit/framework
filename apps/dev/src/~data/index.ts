import React from 'react';
import { site, menu } from './wpfasty/context';
import { about } from './pages/about';
import { home } from './pages/home';
import { blog } from './pages/blog';
import { getPosts, getCategories, getTags, getAuthors, getPages, getHomePage, getAboutPage } from './posts/index-static';

// Normalize and aggregate derived data so counts are consistent
async function normalize() {
  // Fetch all data in parallel for better performance
  const [rawPosts, apiCategories, apiTags, apiAuthors] = await Promise.all([
    getPosts(),
    getCategories(),
    getTags(),
    getAuthors()
  ]);

  // Calculate author counts from posts
  const authorCountMap = new Map<number, number>();
  for (const post of rawPosts.posts) {
    if (post.author) {
      authorCountMap.set(post.author.id, (authorCountMap.get(post.author.id) || 0) + 1);
    }
  }

  // Update author counts
  const authors = apiAuthors.map(author => ({
    ...author,
    count: authorCountMap.get(author.id) || 0
  }));

  // For posts, we can keep the existing logic but with API data as source of truth
  // Categories and tags in posts should match the API data
  const categoryMap = new Map(apiCategories.map(c => [c.id, c]));
  const tagMap = new Map(apiTags.map(t => [t.id, t]));
  const authorMap = new Map(authors.map(a => [a.id, a]));

  const posts = {
    posts: rawPosts.posts.map(p => ({
      ...p,
      categories: (p.categories || []).map(c => {
        const apiCat = categoryMap.get(c.id);
        return apiCat ? { ...c, count: apiCat.count } : c;
      }),
      tags: (p.tags || []).map(t => {
        const apiTag = tagMap.get(t.id);
        return apiTag ? { ...t, count: apiTag.count } : t;
      }),
      author: p.author ? authorMap.get(p.author.id) || p.author : undefined
    }))
  };

  return { posts, categories: apiCategories, tags: apiTags, authors };
}

// Async function to get render context with dynamic posts
export async function getRenderContext() {
  const [normalized, pages, homePage, aboutPage] = await Promise.all([
    normalize(),
    getPages(),
    getHomePage(),
    getAboutPage()
  ]);

  const { posts, categories, tags, authors } = normalized;

  return {
    about: aboutPage,
    home: homePage,
    blog,
    posts,
    categories,
    tags,
    authors,
    pages,
    site,
    menu,
  } as const;
}

// Current implementation - static data (for backward compatibility)
export const renderContext = {
  about,
  home,
  blog,
  posts: { posts: [] }, // Empty fallback
  categories: [],
  tags: [],
  authors: [],
  pages: [], // Static pages fallback
  site,
  menu,
} as const;

// React hook for loading render context dynamically
export function useRenderContext() {
  const [context, setContext] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    getRenderContext()
      .then((data) => {
        setContext(data);
      })
      .catch((err) => {
        console.error('Failed to load render context:', err);
        setError(err.message);
        // Fallback to static context
        setContext(renderContext);
      })
      .finally(() => setLoading(false));
  }, []);

  return { context, loading, error };
}

// Future implementation includes:
// ✅ API calls
// ✅ CMS integration
// ✅ Error handling
// ✅ React hook for dynamic loading
// - Caching layer (next step)

export type RenderContextKey = keyof typeof renderContext;