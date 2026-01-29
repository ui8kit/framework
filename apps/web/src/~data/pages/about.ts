import type { AboutData } from '../types';

const urlImage = 'https://images.unsplash.com/vector-1746618662777-7058cb830c6a?q=80&w=1934&auto=format&fit=crop';

export const about: AboutData = {
  page: {
    title: 'Tailwind to Semantic HTML5 Transformation',
    excerpt: 'Revolutionary approach to modern frontend development: Build with utility-first CSS, deploy with semantic HTML5 classes.',
    content: 'Experience the future of component-driven development where Tailwind CSS utilities automatically transform into clean, semantic HTML5 classes. Our methodology bridges the gap between rapid prototyping and production-ready, maintainable code. Switch between development and production modes to see how utility classes become semantic BEM-like conventions instantly. Perfect for design systems, component libraries, and scalable frontend architecture.',
  },
  features: [
    {
      id: 1,
      title: 'Utility-First to Semantic CSS Architecture',
      excerpt: 'Leverage Tailwind CSS for rapid development while maintaining clean, semantic HTML5 output. Our automated extraction process converts utility classes into meaningful, BEM-inspired semantic classes that improve code readability, SEO performance, and maintainability.',
      featuredImage: {
        url: urlImage,
        alt: 'Utility-First to Semantic CSS Architecture',
        caption: 'Clean semantic HTML5 classes from Tailwind utilities',
      },
    },
    {
      id: 2,
      title: 'Component-Driven Development with CVA',
      excerpt: 'Build robust React components using Class Variance Authority (CVA) patterns that automatically generate semantic class variants. Perfect for design systems, atomic design methodology, and TypeScript-first development workflows that scale across enterprise applications.',
      featuredImage: {
        url: urlImage,
        alt: 'Component-Driven Development',
        caption: 'CVA patterns for scalable component architecture',
      },
    },
    {
      id: 3,
      title: 'Production-Ready Semantic HTML5 Output',
      excerpt: 'Generate framework-agnostic, accessible HTML5 markup with semantic class names that follow W3C standards. Ideal for headless CMS integration, server-side rendering, progressive web apps, and cross-platform compatibility with improved Core Web Vitals scores.',
      featuredImage: {
        url: urlImage,
        alt: 'Production-Ready Semantic HTML5',
        caption: 'Framework-agnostic semantic HTML5 for better performance',
      },
    },
  ]
};