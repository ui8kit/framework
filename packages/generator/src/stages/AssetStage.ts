import type { IPipelineStage, IPipelineContext } from '../core/interfaces';
import { AssetService, type AssetServiceOutput } from '../services/asset';

/**
 * AssetStage - Pipeline stage for asset copying
 * 
 * Copies CSS, JS, and public assets to output directory.
 */
export class AssetStage implements IPipelineStage {
  readonly name = 'asset';
  readonly dependencies: string[] = ['html'];
  
  private service: AssetService;
  
  constructor() {
    this.service = new AssetService();
  }
  
  async execute(context: IPipelineContext): Promise<void> {
    const { config, logger, eventBus } = context;
    
    // Initialize service
    await this.service.initialize({ config, logger, eventBus, registry: null as any });
    
    const cssSourceDir = config.css?.outputDir ?? './dist/css';
    const outputDir = config.html?.outputDir ?? './dist/html';
    const mode = config.html?.mode ?? 'tailwind';
    
    logger.info('Copying assets...');
    
    const result = await this.service.execute({
      cssSourceDir,
      jsSourceDir: config.assets?.jsDir,
      publicDir: config.assets?.publicDir,
      outputDir: `${outputDir}/assets`,
      cssMode: mode === 'semantic' || mode === 'inline' ? 'semantic' : 'tailwind',
    });
    
    // Store result in context
    context.state.set('asset:result', result);
    
    logger.info(`Copied ${result.copiedFiles.length} asset(s) (${formatSize(result.totalSize)})`);
    
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
