/**
 * @ui8kit/generator - Static Site Generator
 * 
 * Modern architecture with Orchestrator, Services, and Pipeline.
 */

// =============================================================================
// Main API - Simple usage
// =============================================================================

export { generate, createGenerator } from './generate';
export type { GenerateConfig, GenerateResult } from './generate';

// Re-export config types for convenience
export type { GeneratorConfig, RouteConfig } from './core/interfaces';

// =============================================================================
// Orchestrator System - Advanced usage
// =============================================================================

// Core exports
export {
  Orchestrator,
  Pipeline,
  createPipelineContext,
  EventBus,
  ServiceRegistry,
  CircularDependencyError,
  ServiceNotFoundError,
  Logger,
} from './core';

// Types and interfaces
export type {
  IOrchestrator,
  GeneratorResult,
  IService,
  IServiceContext,
  IServiceRegistry,
  BaseService,
  IPipeline,
  IPipelineStage,
  IPipelineContext,
  IPlugin,
  IPluginContext,
  ILogger,
  LogLevel,
  IEventBus,
  ITypedEventBus,
  GeneratorEvents,
} from './core';

export { DEFAULT_CONFIG } from './core';

// =============================================================================
// Services
// =============================================================================

export {
  LayoutService,
  RenderService,
  ViewService,
  CssService,
  HtmlService,
  AssetService,
  HtmlConverterService,
  ClassLogService,
} from './services';

export type {
  LayoutServiceInput,
  LayoutServiceOutput,
  LayoutTemplateConfig,
  RenderServiceInput,
  RenderRouteInput,
  RenderComponentInput,
  RenderServiceOutput,
  RouterParser,
  ViewServiceInput,
  ViewServiceOutput,
  CssServiceInput,
  CssServiceOutput,
  CssOutputFileNames,
  HtmlServiceInput,
  HtmlServiceOutput,
  AssetServiceInput,
  AssetServiceOutput,
  CssFileNames,
  HtmlConverterInput,
  HtmlConverterOutput,
  ClassLogServiceInput,
  ClassLogServiceOutput,
  ClassLogFile,
} from './services';

// =============================================================================
// Stages
// =============================================================================

export {
  LayoutStage,
  ViewStage,
  CssStage,
  HtmlStage,
  AssetStage,
  DEFAULT_STAGES,
} from './stages';

// =============================================================================
// Plugins
// =============================================================================

export {
  PluginManager,
  createPlugin,
} from './plugins';

export type {
  PluginDefinition,
  PluginHooks,
} from './plugins';

// =============================================================================
// Utilities
// =============================================================================

export {
  emitVariantsApplyCss,
  emitVariantsArtifacts,
  type EmitVariantsApplyCssOptions,
  type VariantsArtifacts,
} from './scripts/emit-variants-apply.js';

export {
  emitVariantElements,
  type EmitVariantElementsOptions,
  type EmitVariantElementsResult,
} from './scripts/emit-variant-elements.js';
