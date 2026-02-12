/**
 * Shared types for Examples block and layout views.
 * Not generated — preserved as-is for type exports.
 */

export interface ExampleTab {
  href: string;
  label: string;
  active?: boolean;
}

export interface ExamplesButtonContent {
  title?: string;
  defaultLabel?: string;
  outlineLabel?: string;
  ghostLabel?: string;
}

export interface ExamplesBadgeContent {
  title?: string;
  defaultLabel?: string;
  secondaryLabel?: string;
  outlineLabel?: string;
}

export interface ExamplesTypographyContent {
  title?: string;
  heading?: string;
  body?: string;
}

export interface ExamplesActionsContent {
  explore?: string;
  allComponents?: string;
}

export interface ExamplesContent {
  title?: string;
  description?: string;
  button?: ExamplesButtonContent;
  badge?: ExamplesBadgeContent;
  typography?: ExamplesTypographyContent;
  actions?: ExamplesActionsContent;
}
