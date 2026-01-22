import type { IPipelineStage, IPipelineContext } from '../core/interfaces';
import { ViewService, type ViewServiceOutput } from '../services/view';

/**
 * ViewStage - Pipeline stage for view generation
 * 
 * Renders React components to Liquid view files.
 */
export class ViewStage implements IPipelineStage {
  readonly name = 'view';
  readonly dependencies: string[] = ['layout'];
  
  private service: ViewService;
  
  constructor() {
    this.service = new ViewService();
  }
  
  async execute(context: IPipelineContext): Promise<void> {
    const { config, logger, eventBus } = context;
    
    // Initialize service
    await this.service.initialize({ config, logger, eventBus, registry: null as any });
    
    const entryPath = config.css?.entryPath ?? './src/main.tsx';
    const viewsDir = config.html?.viewsDir ?? './views';
    const routes = config.html?.routes ?? {};
    
    logger.info('Generating views...');
    
    const result = await this.service.execute({
      entryPath,
      viewsDir,
      routes,
      partials: config.html?.partials,
    });
    
    // Store result in context
    context.state.set('view:result', result);
    
    logger.info(`Generated ${result.views.length} view(s)`);
    
    if (result.partials && result.partials.length > 0) {
      logger.info(`Generated ${result.partials.length} partial(s)`);
    }
    
    eventBus.emit('stage:complete', {
      name: this.name,
      result,
    });
  }
}
