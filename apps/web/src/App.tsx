import { Outlet } from 'react-router-dom'
import { MainLayout } from '@ui8kit/blocks'
import { Stack } from '@ui8kit/core'
import { 
  SearchBar, 
  CategoryList, 
  TagList, 
  PopularPosts, 
  NewsletterSignup 
} from '@/components'
import { menu } from '@/~data/wpfasty/context'

// Transform menu items for header
const navItems = menu.primary.items.map(item => ({
  id: `nav-${item.id}`,
  title: item.title,
  url: item.url,
}))

const footerSections = [
  {
    title: 'Product',
    links: [
      { label: 'Features', href: '#' },
      { label: 'Pricing', href: '#' },
      { label: 'Security', href: '#' },
      { label: 'Enterprise', href: '#' },
    ]
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '#' },
      { label: 'Press', href: '#' },
    ]
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'License', href: '#' },
      { label: 'Contact', href: '/contact' },
    ]
  },
]

// Sidebar content with dynamic data
const SidebarContent = () => (
  <Stack gap="6" data-class="sidebar-widgets">
    <SearchBar />
    <CategoryList items={[]} />
    <TagList items={[]} />
    <PopularPosts />
    <NewsletterSignup />
  </Stack>
)

export default function App() {
  return (
    <MainLayout
      mode="with-sidebar"
      navItems={navItems}
      footerSections={footerSections}
      sidebar={<SidebarContent />}
      headerTitle="UI8Kit"
      headerSubtitle="Design System"
    >
      <Outlet />
    </MainLayout>
  )
}
