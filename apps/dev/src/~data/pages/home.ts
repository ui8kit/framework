import type { HomeData } from '../types';

const urlImage = 'https://images.unsplash.com/vector-1746618662777-7058cb830c6a?q=80&w=1934&auto=format&fit=crop';

export const home: HomeData = {
  page: {
    title: 'Built with Pure HTML5 Semantic Structure',
    excerpt: 'Experience the power of clean, semantic HTML5 architecture combined with modern React components and Tailwind CSS transformation.',
    content: 'This website demonstrates the perfect implementation of semantic HTML5 structure, where every element serves a meaningful purpose. Built with clean, accessible markup that follows W3C standards, our approach transforms Tailwind CSS utilities into production-ready semantic classes. Explore how modern frontend architecture combines rapid development with maintainable, SEO-optimized code that works flawlessly across all devices and assistive technologies.',
  },
  features: [
    {
      id: 1,
      title: 'About Our Approach',
      excerpt: 'Discover how we transform Tailwind utilities into clean HTML5 semantic classes. Learn about our revolutionary methodology that bridges utility-first development with semantic production code, creating accessible, SEO-friendly markup.',
      featuredImage: {
        url: urlImage,
        alt: 'Semantic HTML5 transformation approach',
        caption: 'Utility-first to semantic HTML5 transformation',
      },
    },
    {
      id: 2,
      title: 'Blog & Insights',
      excerpt: 'Deep dive into modern frontend development practices, clean code principles, and semantic HTML5 techniques. Explore articles about component architecture, accessibility best practices, and performance optimization strategies.',
      featuredImage: {
        url: urlImage,
        alt: 'Frontend development blog and insights',
        caption: 'Clean code and semantic HTML5 insights',
      },
    },
    {
      id: 3,
      title: 'Three Pillars Architecture',
      excerpt: 'Explore the foundational pillars of modern frontend development: Semantic HTML5 Foundation, Component-Driven Architecture, and Utility-to-Semantic Transformation. See how these principles create scalable, maintainable applications.',
      featuredImage: {
        url: urlImage,
        alt: 'Three pillars of modern frontend architecture',
        caption: 'Semantic HTML5, Components, and Clean Architecture',
      },
    },
  ]
};