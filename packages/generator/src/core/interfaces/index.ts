/**
 * Core interfaces for the generator orchestrator.
 * 
 * These interfaces define the contracts for:
 * - Services: Individual units of functionality
 * - Pipeline: Orchestration of generation stages
 * - EventBus: Inter-service communication
 * - Logger: Logging abstraction
 */

export type {
  IService,
  IServiceContext,
  IServiceRegistry,
  ServiceMetadata,
} from './IService';

export { BaseService } from './IService';

export type {
  IPipeline,
  IPipelineStage,
  IPipelineContext,
  PipelineResult,
  StageResult,
  PipelineOptions,
} from './IPipeline';

export type {
  IEventBus,
  ITypedEventBus,
  EventHandler,
  GeneratorEvents,
} from './IEventBus';

export type {
  ILogger,
  LogLevel,
  LoggerOptions,
} from './ILogger';
