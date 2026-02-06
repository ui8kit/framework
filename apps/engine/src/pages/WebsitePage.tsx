import { Link } from 'react-router-dom';
import { MainLayout } from '@/layouts';
import { HeroBlock, FeaturesBlock, CTABlock, PricingBlock, TestimonialsBlock } from '@ui8kit/blocks';
import { fixtures } from '@ui8kit/data';
import { Stack, Button } from '@ui8kit/core';

// Navigation items for the header
const navItems = [
  { id: 'home', title: 'Home', url: '/' },
  { id: 'pricing', title: 'Pricing', url: '#pricing' },
  { id: 'dashboard', title: 'Dashboard', url: '/dashboard' },
];

// Sidebar widgets
const SidebarContent = () => (
  <Stack gap="4" data-class="sidebar-widgets">
    <div data-class="sidebar-widget">
      <h3 className="text-sm font-semibold mb-2">Quick Links</h3>
      <Stack gap="1">
        <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
        <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">Dashboard</Link>
      </Stack>
    </div>
  </Stack>
);

/**
 * Website Page — MainLayout showcase
 *
 * Demonstrates: website layout with sidebar, all marketing blocks
 */
export function WebsitePage() {
  return (
    <MainLayout
      mode="full"
      navItems={navItems}
      sidebar={<SidebarContent />}
      headerTitle="UI8Kit"
      headerSubtitle="Template Engine"
    >
      <HeroBlock {...fixtures.hero} />
      <FeaturesBlock {...fixtures.features} />
      <CTABlock {...fixtures.cta} />
      <PricingBlock {...fixtures.pricing} />
      <TestimonialsBlock {...fixtures.testimonials} />
    </MainLayout>
  );
}
