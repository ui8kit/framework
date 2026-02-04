// Main export for @ui8kit/data
// Re-export all fixtures and types

import hero from './fixtures/hero.json';
import features from './fixtures/features.json';
import pricing from './fixtures/pricing.json';
import testimonials from './fixtures/testimonials.json';
import cta from './fixtures/cta.json';
import dashboard from './fixtures/dashboard.json';

export const fixtures = {
  hero: hero as import('./types').HeroFixture,
  features: features as import('./types').FeaturesFixture,
  pricing: pricing as import('./types').PricingFixture,
  testimonials: testimonials as import('./types').TestimonialsFixture,
  cta: cta as import('./types').CTAFixture,
  dashboard: dashboard as import('./types').DashboardFixture,
};

export * from './types';
