export { LayoutStage } from './LayoutStage';
export { ViewStage } from './ViewStage';
export { CssStage } from './CssStage';
export { HtmlStage } from './HtmlStage';
export { AssetStage } from './AssetStage';
export { MdxStage, type IMdxService, type MdxServiceInput, type MdxServiceOutput, type MdxServiceContext } from './MdxStage';
export { TemplateStage, type TemplateStageOptions } from './TemplateStage';

// Default generation pipeline stages
export const DEFAULT_STAGES = [
  'layout',
  'view',
  'css',
  'html',
  'asset',
  'mdx',      // Optional, runs when mdx.enabled=true
  'template', // Optional, runs when template.enabled=true
] as const;
