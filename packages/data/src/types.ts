// Type definitions for fixtures

export interface HeroFixture {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
  backgroundImage?: string;
}

export interface FeaturesFixture {
  title?: string;
  subtitle?: string;
  features?: Array<{
    id: string;
    title: string;
    description: string;
    icon?: string;
  }>;
}

export interface PricingFixture {
  title?: string;
  subtitle?: string;
  plans?: Array<{
    id: string;
    name: string;
    price: string;
    period?: string;
    features: string[];
    ctaText?: string;
    ctaUrl?: string;
  }>;
}

export interface TestimonialsFixture {
  title?: string;
  testimonials?: Array<{
    id: string;
    name: string;
    role?: string;
    company?: string;
    content: string;
    avatar?: string;
  }>;
}

export interface CTAFixture {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaUrl?: string;
  secondaryCtaText?: string;
  secondaryCtaUrl?: string;
}

export interface ProductsFixture {
  products?: Array<{
    id: string;
    title: string;
    description?: string;
    price?: string;
    image?: string;
    url?: string;
  }>;
}

export interface DashboardFixture {
  widgets?: Array<{
    id: string;
    type: string;
    title: string;
    data?: Record<string, unknown>;
  }>;
}
