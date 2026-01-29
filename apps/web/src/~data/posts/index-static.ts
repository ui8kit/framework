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
      id: 4,
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
      id: 5,
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
      id: 6,
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
    },
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
      id: 7,
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
      id: 8,
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
      id: 9,
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