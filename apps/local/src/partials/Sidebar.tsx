import type { ReactNode } from "react";
import { Block, Box, Stack, Text } from "@ui8kit/core";

export interface SidebarProps {
  children?: ReactNode;
  className?: string;
  dataClass?: string;
  title?: string;
}

export function Sidebar({ children, className, dataClass, title }: SidebarProps) {
  return (
    <Block
      component="aside"
      className={className}
      data-class={dataClass || "sidebar"}
    >
      <Box p="4" data-role="dash-sidebar-box">
        <Stack gap="4" data-role="dash-sidebar-stack" data-class="sidebar-stack">
          {title && (
            <Text bg="muted-foreground" data-role="dash-sidebar-title">
              {title}
            </Text>
          )}
          {children}
        </Stack>
      </Box>
    </Block>
  );
}

