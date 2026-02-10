import { Stack, Text, Button } from '@ui8kit/core';
import { If, Loop, Var } from '@ui8kit/template';

export type DashSidebarLink = {
  label: string;
  href: string;
  active?: boolean;
};

export type DashSidebarProps = {
  label?: string;
  links?: DashSidebarLink[];
  'data-class'?: string;
};

/**
 * Dashboard sidebar navigation block. 
 * Pure presentational: label and links come from external context/props.
 */
export function DashSidebar({
  label,
  links,
  'data-class': dataClass,
}: DashSidebarProps) {
  return (
    <Stack gap="2" p="4" data-class={dataClass ?? 'dash-sidebar-nav'}>
      <Text
        fontSize="xs"
        fontWeight="semibold"
        textColor="muted-foreground"
        data-class="dash-sidebar-label"
      >
        <Var name="label" value={label} />
      </Text>
      <If test="links" value={(links ?? []).length > 0}>
        <Loop each="links" as="link" data={links ?? []}>
          {(link: DashSidebarLink) => (
            <Button
              href={link.href}
              size="sm"
              variant={link.active ? 'secondary' : 'ghost'}
              justify="start"
              data-class="dash-sidebar-link"
            >
              <Var name="link.label" value={link.label} />
            </Button>
          )}
        </Loop>
      </If>
    </Stack>
  );
}
