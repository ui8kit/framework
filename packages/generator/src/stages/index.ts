export { LayoutStage } from './LayoutStage';
export { ViewStage } from './ViewStage';
export { CssStage } from './CssStage';
export { HtmlStage } from './HtmlStage';
export { AssetStage } from './AssetStage';

// Default generation pipeline stages
export const DEFAULT_STAGES = [
  'layout',
  'view',
  'css',
  'html',
  'asset',
] as const;
