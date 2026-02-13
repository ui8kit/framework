import { Stack, Text, Button } from '@ui8kit/core';
import { If, Loop, Var } from '@ui8kit/template';
import { EMPTY_ARRAY } from '@ui8kit/data';

export type SidebarLink = {
  label: string;
  href: string;
};

export type SidebarContentProps = {
  title?: string;
  links?: SidebarLink[];
  'data-class'?: string;
};

/**
 * Sidebar content block for website layout.
 * Pure presentational: title and links come from external context/props.
 */
export function SidebarContent({
  title,
  links,
  'data-class': dataClass,
}: SidebarContentProps) {
  return (
    <Stack gap="4" data-class={dataClass ?? 'sidebar-widgets'}>
      <Stack component="nav" data-class="sidebar-widget">
        <Text component="h3" fontSize="sm" fontWeight="semibold" data-class="sidebar-widget-title">
          <If test="title" value={!!(title ?? '')}>
            <Var name="title" value={title ?? ''} />
          </If>
        </Text>
        <If test="links" value={(links ?? EMPTY_ARRAY).length > 0}>
          <Stack gap="1" data-class="sidebar-links">
            <Loop each="links" as="link" data={links ?? EMPTY_ARRAY}>
              {(link: SidebarLink) => (
                <Button
                  href={link.href}
                  variant="link"
                  size="sm"
                  justify="start"
                  data-class="sidebar-link"
                >
                  <Var name="link.label" value={link.label} />
                </Button>
              )}
            </Loop>
          </Stack>
        </If>
      </Stack>
    </Stack>
  );
}
