import { Block, Stack } from '@ui8kit/core'
import { ReactNode } from 'react'

type SidebarProps = {
  children: ReactNode
  position?: 'left' | 'right'
}

export function Sidebar({ children, position = 'right' }: SidebarProps) {
  return (
    <Block 
      component="aside" 
      data-class={`sidebar sidebar-${position}`}
    >
      <Stack gap="6" data-class="sidebar-content">
        {children}
      </Stack>
    </Block>
  )
}
