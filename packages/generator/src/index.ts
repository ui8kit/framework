// Legacy generator (deprecated, use Orchestrator instead)
import { Generator, type GeneratorConfig as LegacyGeneratorConfig, type RouteConfig as LegacyRouteConfig } from './generator.js';

/** @deprecated Use Orchestrator instead */
export { Generator };
/** @deprecated Use GeneratorConfig from core instead */
export type { LegacyGeneratorConfig, LegacyRouteConfig };

/** @deprecated Use new Orchestrator() instead */
export const generator = new Generator();

// ============================================================
// New Orchestrator System
// ============================================================

// Core exports
export {
  // Orchestrator
  Orchestrator,
  // Pipeline
  Pipeline,
  createPipelineContext,
  // Event Bus
  EventBus,
  // Service Registry
  ServiceRegistry,
  CircularDependencyError,
  ServiceNotFoundError,
  // Logger
  Logger,
} from './core';

// Types and interfaces
export type {
  // Config
  GeneratorConfig,
  RouteConfig,
  // Interfaces
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

// Services
export {
  LayoutService,
  RenderService,
  ViewService,
  CssService,
  HtmlService,
  AssetService,
  HtmlConverterService,
} from './services';

export type {
  LayoutServiceInput,
  LayoutServiceOutput,
  RenderServiceInput,
  RenderRouteInput,
  RenderComponentInput,
  RenderServiceOutput,
  ViewServiceInput,
  ViewServiceOutput,
  CssServiceInput,
  CssServiceOutput,
  HtmlServiceInput,
  HtmlServiceOutput,
  AssetServiceInput,
  AssetServiceOutput,
  HtmlConverterInput,
  HtmlConverterOutput,
} from './services';

// Stages
export {
  LayoutStage,
  ViewStage,
  CssStage,
  HtmlStage,
  AssetStage,
  DEFAULT_STAGES,
} from './stages';

// Plugins
export {
  PluginManager,
  createPlugin,
} from './plugins';

export type {
  PluginDefinition,
  PluginHooks,
} from './plugins';

// Variant scripts (utilities)
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