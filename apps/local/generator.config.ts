#!/usr/bin/env bun

import { generator } from '@ui8kit/generator';
import type { GeneratorConfig } from '@ui8kit/generator/src/generator.js';

// Define HTML routes first
const htmlRoutes = {
  '/': {
    title: 'UI8Kit - Next Generation UI System',
    seo: {
      description: 'Build beautiful interfaces with React & CSS3. Type-safe components with semantic static generation.',
      keywords: ['ui', 'react', 'css3', 'typescript', 'components', 'design-system']
    }
  },
  '/about': {
    title: 'About UI8Kit',
    seo: {
      description: 'Learn more about UI8Kit - a comprehensive UI system for modern web development.',
      keywords: ['about', 'ui8kit', 'react', 'css3']
    }
  }
};

export const config: GeneratorConfig = {
  app: {
    name: 'UI8Kit App',
    lang: 'en'
  },

  css: {
    entryPath: './src/main.tsx',
    routes: Object.keys(htmlRoutes), // Generate CSS for all HTML routes
    outputDir: './dist/css',
    pureCss: true
  },

  html: {
    viewsDir: './views',
    routes: htmlRoutes,
    outputDir: './dist/html'
  },

  assets: {
    copy: ['./public/**/*']
  }
};

// Run generation if this file is executed directly
if (import.meta.main) {
  console.log('🛠️ Starting static site generation...');
  await generator.generate(config);
}
