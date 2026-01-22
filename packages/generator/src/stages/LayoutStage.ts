import type { IPipelineStage, IPipelineContext } from '../core/interfaces';
import { LayoutService, type LayoutServiceOutput } from '../services/layout';

/**
 * LayoutStage - Pipeline stage for layout initialization
 * 
 * Ensures layout templates exist, creating defaults if needed.
 */
export class LayoutStage implements IPipelineStage {
  readonly name = 'layout';
  readonly dependencies: string[] = [];
  
  private service: LayoutService;
  
  constructor(options?: { templatesDir?: string }) {
    this.service = new LayoutService(options);
  }
  
  async execute(context: IPipelineContext): Promise<void> {
    const { config, logger, eventBus } = context;
    
    // Initialize service
    await this.service.initialize({ config, logger, eventBus, registry: null as any });
    
    const viewsDir = config.html?.viewsDir ?? './views';
    
    logger.info('Initializing layouts...');
    
    const result = await this.service.execute({ viewsDir });
    
    // Store result in context for other stages
    context.state.set('layout:result', result);
    
    if (result.created.length > 0) {
      logger.info(`Created ${result.created.length} layout template(s)`);
    }
    
    eventBus.emit('stage:complete', {
      name: this.name,
      result,
    });
  }
}
