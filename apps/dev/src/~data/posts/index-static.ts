import type { WPFastyContext } from '../wpfasty/types';

type PostsCollection = {
  posts: (WPFastyContext['archive']['posts'] & { tags?: { id: number; name: string; slug: string }[]; author?: { id: number; name: string; slug: string } })[];
};

export const posts: PostsCollection = {
  posts: [
    {
      title: 'Three Pillars of Modern Frontend Architecture',
      content: `
        <p>The future of scalable frontend development rests on three fundamental pillars that transform how we build web applications.</p>
        <h2>1. Semantic HTML5 Foundation</h2>
        <p><strong>Semantic elements</strong> ensure accessibility, SEO optimization, and future-proof markup that follows W3C standards. Use <code>&lt;article&gt;</code>, <code>&lt;section&gt;</code>, <code>&lt;nav&gt;</code>, and <code>&lt;aside&gt;</code> appropriately.</p>
        <blockquote>
          Accessible, meaningful markup is the bedrock of any long-lived web application.
        </blockquote>
        <h2>2. Component-Driven Architecture</h2>
        <p>Leverage atomic design with <em>TypeScript-first</em> components that are reusable, testable, and scalable across apps.</p>
        <ul>
          <li>Clear inputs/outputs (props)</li>
          <li>Predictable composition</li>
          <li>Design tokens and variants</li>
        </ul>
        <h2>3. Utility-to-Semantic Transformation</h2>
        <p>Bridge the gap between rapid prototyping and production code. Extract utilities into <code>@apply</code>-driven semantic classes and prop variants.</p>
        <pre><code>// Example of semantic class via @apply
.card { @apply bg-card text-card-foreground rounded-md shadow-sm p-6; }
</code></pre>
        <hr />
        <p>With these pillars, you get both developer experience and maintainable code.</p>
      `,
      slug: 'three-pillars-modern-frontend-architecture',
      url: '/posts/three-pillars-modern-frontend-architecture',
      id: 1,
      excerpt: 'Discover the three foundational pillars that define modern frontend architecture: semantic HTML5, component-driven development, and utility-to-semantic transformation.',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
        width: 800,
        height: 600,
        alt: 'Three pillars of modern frontend architecture visualization'
      },
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300&h=200&fit=crop',
        width: 300,
        height: 200,
        alt: 'Three pillars architecture thumbnail'
      },
      meta: {
        _edit_last: '1',
        _edit_lock: '1640995200:1'
      },
      categories: [
        {
          name: 'Architecture',
          url: '/category/architecture',
          id: 1,
          slug: 'architecture',
          description: 'Posts about software architecture and design patterns',
          count: 8
        },
        {
          name: 'Semantic HTML',
          url: '/category/semantic-html',
          id: 2,
          slug: 'semantic-html',
          description: 'HTML5 semantics and accessibility best practices',
          count: 12
        }
      ],
      tags: [
        { id: 1, name: 'frontend', slug: 'frontend' },
        { id: 2, name: 'architecture', slug: 'architecture' }
      ],
      author: { id: 13, name: 'John Doe', slug: 'john-doe' },
      date: {
        formatted: '2024-01-15T10:30:00Z',
        display: 'January 15, 2024',
        modified: '2024-01-16T14:20:00Z',
        modified_display: 'January 16, 2024',
        timestamp: 1705315800,
        year: '2024',
        month: '01',
        day: '15'
      }
    },
    {
      title: 'Clean Code Principles for Semantic HTML5 Components',
      content: `
        <p>Writing clean, maintainable frontend code starts with <strong>semantic HTML5</strong> and continues through every layer of your component architecture.</p>
        <h2>Meaningful Markup</h2>
        <p>Use the right element for the right job to improve accessibility and SEO.</p>
        <h2>BEM-Inspired Class Naming</h2>
        <p>Adopt <code>.block__element--modifier</code> for readability and maintainability.</p>
        <h2>Component Composition</h2>
        <p>Favor composition over inheritance; keep components small and focused.</p>
        <h2>TypeScript Integration</h2>
        <p>Gain compile-time safety and better DX with typed props and utilities.</p>
      `,
      slug: 'clean-code-principles-semantic-html5-components',
      url: '/posts/clean-code-principles-semantic-html5-components',
      id: 2,
      excerpt: 'Learn how to write clean, maintainable frontend code using semantic HTML5 elements, BEM methodology, and component composition patterns.',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
        width: 800,
        height: 600,
        alt: 'Clean code principles and semantic HTML5 structure'
      },
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop',
        width: 300,
        height: 200,
        alt: 'Clean code principles thumbnail'
      },
      meta: {
        _edit_last: '1',
        _edit_lock: '1640995300:1'
      },
      categories: [
        {
          name: 'Clean Code',
          url: '/category/clean-code',
          id: 3,
          slug: 'clean-code',
          description: 'Clean code principles and best practices',
          count: 15
        },
        {
          name: 'Component Design',
          url: '/category/component-design',
          id: 4,
          slug: 'component-design',
          description: 'Component architecture and design patterns',
          count: 9
        }
      ],
      tags: [
        { id: 3, name: 'clean-code', slug: 'clean-code' },
        { id: 4, name: 'typescript', slug: 'typescript' }
      ],
      author: { id: 24, name: 'Jane Smith', slug: 'jane-smith' },
      date: {
        formatted: '2024-01-20T15:45:00Z',
        display: 'January 20, 2024',
        modified: '2024-01-21T09:30:00Z',
        modified_display: 'January 21, 2024',
        timestamp: 1705748700,
        year: '2024',
        month: '01',
        day: '20'
      }
    },
    {
      title: 'From Tailwind Utilities to Production-Ready Semantic Classes',
      content: `
        <p>The journey from utility-first development to semantic HTML5 production code reshapes modern workflows.</p>
        <h2>Development Velocity</h2>
        <p>Prototype quickly with utilities, then extract into semantic classes.</p>
        <h2>Automated Extraction</h2>
        <p>Transform <code>flex items-center justify-between</code> into <code>.header-navigation</code> via build tooling.</p>
        <h2>CVA Patterns</h2>
        <p>Generate type-safe variants that map directly to design tokens.</p>
        <figure>
          <img src="https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=400&fit=crop" alt="Utility to semantic transformation" />
          <figcaption>Utilities compile to semantic UI with tokens and variants.</figcaption>
        </figure>
      `,
      slug: 'tailwind-utilities-production-semantic-classes',
      url: '/posts/tailwind-utilities-production-semantic-classes',
      id: 3,
      excerpt: 'Transform Tailwind utility classes into production-ready semantic HTML5 with automated extraction, CVA patterns, and framework-agnostic output.',
      featuredImage: {
        url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop',
        width: 800,
        height: 600,
        alt: 'Tailwind CSS transformation to semantic HTML5 classes'
      },
      thumbnail: {
        url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=300&h=200&fit=crop',
        width: 300,
        height: 200,
        alt: 'Tailwind transformation thumbnail'
      },
      meta: {
        _edit_last: '1',
        _edit_lock: '1640995400:1'
      },
      categories: [
        {
          name: 'Tailwind CSS',
          url: '/category/tailwind-css',
          id: 5,
          slug: 'tailwind-css',
          description: 'Tailwind CSS techniques and optimization',
          count: 11
        },
        {
          name: 'Semantic HTML',
          url: '/category/semantic-html',
          id: 2,
          slug: 'semantic-html',
          description: 'HTML5 semantics and accessibility best practices',
          count: 15
        }
      ],
      tags: [
        { id: 5, name: 'tailwind', slug: 'tailwind' },
        { id: 6, name: 'cva', slug: 'cva' }
      ],
      author: { id: 13, name: 'John Doe', slug: 'john-doe' },
      date: {
        formatted: '2024-01-25T12:15:00Z',
        display: 'January 25, 2024',
        modified: '2024-01-25T16:30:00Z',
        modified_display: 'January 25, 2024',
        timestamp: 1706184900,
        year: '2024',
        month: '01',
        day: '25'
      }
    }
  ]
};

// Static function to get posts
export async function getPosts(): Promise<PostsCollection> {
  return posts;
}

// Static function to get all categories
export async function getCategories(): Promise<Array<{
  id: number;
  name: string;
  slug: string;
  count: number;
  description?: string;
}>> {
  const categories = new Map<string, { id: number; name: string; slug: string; count: number; description?: string }>();

  // Extract categories from all posts
  posts.posts.forEach(post => {
    post.categories?.forEach(cat => {
      if (!categories.has(cat.slug)) {
        categories.set(cat.slug, {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          count: 0,
          description: cat.description
        });
      }
      const catData = categories.get(cat.slug)!;
      catData.count++;
    });
  });

  return Array.from(categories.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// Static function to get all tags
export async function getTags(): Promise<Array<{
  id: number;
  name: string;
  slug: string;
  count: number;
}>> {
  const tags = new Map<string, { id: number; name: string; slug: string; count: number }>();

  // Extract tags from all posts
  posts.posts.forEach(post => {
    post.tags?.forEach(tag => {
      if (!tags.has(tag.slug)) {
        tags.set(tag.slug, {
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
          count: 0
        });
      }
      const tagData = tags.get(tag.slug)!;
      tagData.count++;
    });
  });

  return Array.from(tags.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// Static function to get all authors
export async function getAuthors(): Promise<Array<{
  id: number;
  name: string;
  slug: string;
  count: number;
  avatar?: string;
  bio?: string;
}>> {
  const authors = new Map<string, { id: number; name: string; slug: string; count: number; avatar?: string; bio?: string }>();

  // Extract authors from all posts
  posts.posts.forEach(post => {
    if (post.author) {
      const authorSlug = post.author.slug;
      if (!authors.has(authorSlug)) {
        authors.set(authorSlug, {
          id: post.author.id,
          name: post.author.name,
          slug: authorSlug,
          count: 0,
          bio: ''
        });
      }
      const authorData = authors.get(authorSlug)!;
      authorData.count++;
    }
  });

  return Array.from(authors.values()).sort((a, b) => a.name.localeCompare(b.name));
}

// Static function to get all pages
export async function getPages(): Promise<Array<{
  id: number;
  title: string;
  content: string;
  slug: string;
  excerpt: string;
  url: string;
  featuredImage?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
  thumbnail?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
  meta: {
    _edit_last: string;
    _edit_lock: string;
  };
  categories: Array<any>;
  date: {
    formatted: string;
    display: string;
    modified: string;
    modified_display: string;
    timestamp: number;
    year: string;
    month: string;
    day: string;
  };
}>> {
  // Static pages data
  return [
    {
      id: 1,
      title: 'About',
      content: '<p>Learn more about our mission and vision in modern frontend development.</p>',
      slug: 'about',
      excerpt: 'About our frontend development mission',
      url: '/about',
      meta: {
        _edit_last: '1',
        _edit_lock: `${Date.now()}:1`
      },
      categories: [],
      date: {
        formatted: new Date().toISOString(),
        display: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        modified: new Date().toISOString(),
        modified_display: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        timestamp: Math.floor(Date.now() / 1000),
        year: new Date().getFullYear().toString(),
        month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
        day: new Date().getDate().toString().padStart(2, '0')
      }
    },
    {
      id: 2,
      title: 'Contact',
      content: '<p>Get in touch with us for inquiries and collaborations.</p>',
      slug: 'contact',
      excerpt: 'Contact our team',
      url: '/contact',
      meta: {
        _edit_last: '1',
        _edit_lock: `${Date.now()}:1`
      },
      categories: [],
      date: {
        formatted: new Date().toISOString(),
        display: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        modified: new Date().toISOString(),
        modified_display: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        timestamp: Math.floor(Date.now() / 1000),
        year: new Date().getFullYear().toString(),
        month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
        day: new Date().getDate().toString().padStart(2, '0')
      }
    }
  ];
}

// Static function to get home page data with features
export async function getHomePage(): Promise<{
  page: {
    title: string;
    excerpt: string;
    content: string;
  };
  features: Array<{
    id: number;
    title: string;
    excerpt: string;
    featuredImage: {
      url: string;
      alt: string;
      caption: string;
    };
  }>;
}> {
  return {
    page: {
      title: 'Built with Pure HTML5 Semantic Structure',
      excerpt: 'Experience the power of clean, semantic HTML5 architecture combined with modern React components and Tailwind CSS transformation.',
      content: 'This website demonstrates the perfect implementation of semantic HTML5 structure, where every element serves a meaningful purpose. Built with clean, accessible markup that follows W3C standards, our approach transforms Tailwind CSS utilities into production-ready semantic classes. Explore how modern frontend architecture combines rapid development with maintainable, SEO-optimized code that works flawlessly across all devices and assistive technologies.'
    },
    features: [
      {
        id: 1,
        title: 'About Our Approach',
        excerpt: 'Discover how we transform Tailwind utilities into clean HTML5 semantic classes. Learn about our revolutionary methodology that bridges utility-first development with semantic production code, creating accessible, SEO-friendly markup.',
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
          alt: 'Semantic HTML5 transformation approach',
          caption: 'Utility-first to semantic HTML5 transformation'
        }
      },
      {
        id: 2,
        title: 'Blog & Insights',
        excerpt: 'Deep dive into modern frontend development practices, clean code principles, and semantic HTML5 techniques. Explore articles about component architecture, accessibility best practices, and performance optimization strategies.',
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
          alt: 'Frontend development blog and insights',
          caption: 'Clean code and semantic HTML5 insights'
        }
      },
      {
        id: 3,
        title: 'Three Pillars Architecture',
        excerpt: 'Explore the foundational pillars of modern frontend development: Semantic HTML5 Foundation, Component-Driven Architecture, and Utility-to-Semantic Transformation. See how these principles create scalable, maintainable applications.',
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop',
          alt: 'Three pillars of modern frontend architecture',
          caption: 'Semantic HTML5, Components, and Clean Architecture'
        }
      }
    ]
  };
}

// Static function to get about page data with features
export async function getAboutPage(): Promise<{
  page: {
    title: string;
    excerpt: string;
    content: string;
  };
  features: Array<{
    id: number;
    title: string;
    excerpt: string;
    featuredImage: {
      url: string;
      alt: string;
      caption: string;
    };
  }>;
}> {
  return {
    page: {
      title: 'Tailwind to Semantic HTML5 Transformation',
      excerpt: 'Revolutionary approach to modern frontend development: Build with utility-first CSS, deploy with semantic HTML5 classes.',
      content: 'Experience the future of component-driven development where Tailwind CSS utilities automatically transform into clean, semantic HTML5 classes. Our methodology bridges the gap between rapid prototyping and production-ready, maintainable code. Switch between development and production modes to see how utility classes become semantic BEM-like conventions instantly. Perfect for design systems, component libraries, and scalable frontend architecture.'
    },
    features: [
      {
        id: 1,
        title: 'Utility-First to Semantic CSS Architecture',
        excerpt: 'Leverage Tailwind CSS for rapid development while maintaining clean, semantic HTML5 output. Our automated extraction process converts utility classes into meaningful, BEM-inspired semantic classes that improve code readability, SEO performance, and maintainability.',
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop',
          alt: 'Utility-First to Semantic CSS Architecture',
          caption: 'Clean semantic HTML5 classes from Tailwind utilities'
        }
      },
      {
        id: 2,
        title: 'Component-Driven Development with CVA',
        excerpt: 'Build robust React components using Class Variance Authority (CVA) patterns that automatically generate semantic class variants. Perfect for design systems, atomic design methodology, and TypeScript-first development workflows that scale across enterprise applications.',
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
          alt: 'Component-Driven Development',
          caption: 'CVA patterns for scalable component architecture'
        }
      },
      {
        id: 3,
        title: 'Production-Ready Semantic HTML5 Output',
        excerpt: 'Generate framework-agnostic, accessible HTML5 markup with semantic class names that follow W3C standards. Ideal for headless CMS integration, server-side rendering, progressive web apps, and cross-platform compatibility with improved Core Web Vitals scores.',
        featuredImage: {
          url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=800&h=600&fit=crop',
          alt: 'Production-Ready Semantic HTML5',
          caption: 'Framework-agnostic semantic HTML5 for better performance'
        }
      }
    ]
  };
}
