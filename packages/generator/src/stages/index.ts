export { LayoutStage } from './LayoutStage';
export { ViewStage } from './ViewStage';
export { CssStage } from './CssStage';
export { HtmlStage } from './HtmlStage';
export { AssetStage } from './AssetStage';
export { MdxStage, type IMdxService, type MdxServiceInput, type MdxServiceOutput, type MdxServiceContext } from './MdxStage';

// Default generation pipeline stages
export const DEFAULT_STAGES = [
  'layout',
  'view',
  'css',
  'html',
  'asset',
  'mdx', // Optional, runs when mdx.enabled=true
] as const;
