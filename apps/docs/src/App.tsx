import { Outlet } from 'react-router-dom'
import { DashLayout } from '@/layouts/DashLayout'
import { useTheme } from '@/providers/theme'
import {
  Button,
  Stack,
  Title
} from '@ui8kit/core'

// Sidebar Navigation Component
export const Sidebar = () => {
  const menuItems = [
    { label: 'Dashboard', icon: '📊', active: true },
    { label: 'Users', icon: '👥', active: false },
    { label: 'Products', icon: '📦', active: false },
    { label: 'Orders', icon: '🛒', active: false },
    { label: 'Analytics', icon: '📈', active: false },
    { label: 'Settings', icon: '⚙️', active: false },
  ]

  return (
    <Stack gap="4" p="4">
      <Title order={4} mb="4">Admin Panel</Title>
      <Stack gap="2">
        {menuItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? 'primary' : 'ghost'}
            w="full"
          >
            {item.label}
          </Button>
        ))}
      </Stack>
    </Stack>
  )
}

export default function App() {
  const { isDarkMode, toggleDarkMode } = useTheme()

  return (
    <DashLayout
      navbarProps={{
        isDarkMode,
        toggleDarkMode,
        brand: 'Admin Dashboard'
      }}
      sidebar={<Sidebar />}
    >
      <Outlet /> {/* DashboardContent */}
    </DashLayout>
  )
}
