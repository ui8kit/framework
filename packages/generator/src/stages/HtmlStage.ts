import type { IPipelineStage, IPipelineContext } from '../core/interfaces';
import { HtmlService, type HtmlServiceOutput } from '../services/html';

/**
 * HtmlStage - Pipeline stage for HTML generation
 * 
 * Renders Liquid views through layout to final HTML.
 */
export class HtmlStage implements IPipelineStage {
  readonly name = 'html';
  readonly dependencies: string[] = ['css'];
  
  private service: HtmlService;
  
  constructor() {
    this.service = new HtmlService();
  }
  
  async execute(context: IPipelineContext): Promise<void> {
    const { config, logger, eventBus } = context;
    
    // Initialize service
    await this.service.initialize({ config, logger, eventBus, registry: null as any });
    
    const viewsDir = config.html?.viewsDir ?? './views';
    const outputDir = config.html?.outputDir ?? './dist/html';
    const routes = config.html?.routes ?? {};
    const mode = config.html?.mode ?? 'tailwind';
    const cssOutputDir = config.css?.outputDir ?? './dist/css';
    
    logger.info('Generating HTML pages...');
    
    const result = await this.service.execute({
      viewsDir,
      outputDir,
      routes,
      mode,
      stripDataClassInTailwind: config.html?.stripDataClass,
      cssOutputDir,
      appConfig: config.app,
    });
    
    // Store result in context
    context.state.set('html:result', result);
    
    const totalSize = result.pages.reduce((sum, p) => sum + p.size, 0);
    logger.info(`Generated ${result.pages.length} HTML page(s) (${formatSize(totalSize)})`);
    
    eventBus.emit('stage:complete', {
      name: this.name,
      result,
    });
  }
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}
