/**
 * Core module for the generator orchestrator.
 * 
 * Exports all core components:
 * - Interfaces (contracts)
 * - EventBus (inter-service communication)
 * - ServiceRegistry (dependency injection)
 * - Pipeline (stage orchestration)
 * - Logger (logging abstraction)
 */

// Interfaces
export * from './interfaces';

// EventBus
export { EventBus } from './events';

// ServiceRegistry
export { ServiceRegistry, CircularDependencyError, ServiceNotFoundError } from './registry';

// Pipeline
export { Pipeline, PipelineContext } from './pipeline';

// Logger
export { Logger } from './logger';
