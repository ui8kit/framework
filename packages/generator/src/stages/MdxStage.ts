import type { IPipelineStage, IPipelineContext } from '../core/interfaces';

// =============================================================================
// Types (copied from @ui8kit/mdx-react/service to avoid circular dependency)
// =============================================================================

/**
 * Input for MdxService.execute()
 */
export interface MdxServiceInput {
  docsDir: string;
  outputDir: string;
  basePath?: string;
  navOutput?: string;
  components?: Record<string, string>;
  propsSource?: string;
  toc?: {
    minLevel?: number;
    maxLevel?: number;
  };
  htmlMode?: 'tailwind' | 'semantic' | 'inline';
  verbose?: boolean;
  rootDir?: string;  // For resolving @ alias
}

/**
 * Output from MdxService.execute()
 */
export interface MdxServiceOutput {
  pages: number;
  navigation: Array<{ title: string; path: string; order?: number }>;
  generatedPages: Array<{
    urlPath: string;
    outputPath: string;
    title: string;
  }>;
  duration: number;
}

/**
 * Service context for MdxService
 */
export interface MdxServiceContext {
  config?: { html?: { mode?: 'tailwind' | 'semantic' | 'inline' } };
  logger: {
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
  };
  eventBus?: {
    emit(event: string, data?: unknown): void;
    on(event: string, handler: (data: unknown) => void): () => void;
  };
}

/**
 * Interface for MdxService (Dependency Injection)
 */
export interface IMdxService {
  readonly name: string;
  readonly version: string;
  initialize(context: MdxServiceContext): Promise<void>;
  execute(input: MdxServiceInput): Promise<MdxServiceOutput>;
  dispose(): Promise<void>;
}

/**
 * MdxStage - Pipeline stage for MDX documentation generation.
 * 
 * Generates static HTML pages from MDX documentation files.
 * This stage runs after HTML generation (order: 60) and is conditionally
 * enabled when `mdx.enabled: true` in configuration.
 * 
 * @example Configuration in generator.config.ts:
 * ```typescript
 * export const config = {
 *   mdx: {
 *     enabled: true,
 *     docsDir: './docs',
 *     outputDir: './dist/html',
 *     basePath: '/docs',
 *     navOutput: './dist/docs-nav.json',
 *   },
 * };
 * ```
 * 
 * @example With dependency injection:
 * ```typescript
 * import { MdxService } from '@ui8kit/mdx-react/service';
 * const stage = new MdxStage(new MdxService());
 * ```
 */
export class MdxStage implements IPipelineStage<void, MdxServiceOutput> {
  readonly name = 'mdx';
  readonly order = 60; // After HTML stage (order: 3)
  readonly enabled = true;
  readonly dependencies: readonly string[] = ['html'];
  readonly description = 'Generate documentation pages from MDX files';
  
  private service: IMdxService | null;
  private serviceFactory?: () => Promise<IMdxService>;
  
  /**
   * Create MdxStage with optional service injection.
   * 
   * @param service - Optional MdxService instance for dependency injection.
   *                  If not provided, will dynamically import from @ui8kit/mdx-react/service.
   */
  constructor(service?: IMdxService) {
    this.service = service ?? null;
    
    // Lazy load service if not injected
    if (!this.service) {
      this.serviceFactory = async () => {
        const { MdxService } = await import('@ui8kit/mdx-react/service');
        return new MdxService();
      };
    }
  }
  
  /**
   * Get or create the MdxService instance
   */
  private async getService(): Promise<IMdxService> {
    if (!this.service && this.serviceFactory) {
      this.service = await this.serviceFactory();
    }
    if (!this.service) {
      throw new Error('MdxService not available');
    }
    return this.service;
  }
  
  /**
   * Check if the stage should execute.
   * Only runs when mdx.enabled is true in configuration.
   */
  canExecute(context: IPipelineContext): boolean {
    const cfg = context.config as any;
    return cfg?.mdx?.enabled === true;
  }
  
  /**
   * Execute MDX documentation generation.
   */
  async execute(_input: void, context: IPipelineContext): Promise<MdxServiceOutput> {
    const { config, logger, eventBus } = context;
    const cfg = config as any;
    
    // Get service instance (lazy load if needed)
    const service = await this.getService();
    
    // Initialize service with pipeline context
    await service.initialize({
      config: {
        html: { mode: cfg.html?.mode ?? 'tailwind' },
      },
      logger: {
        debug: (msg: string) => logger.debug(msg),
        info: (msg: string) => logger.info(msg),
        warn: (msg: string) => logger.warn(msg),
        error: (msg: string) => logger.error(msg),
      },
      eventBus: {
        emit: (event: string, data?: unknown) => eventBus.emit(event, data),
        on: (event: string, handler: (data: unknown) => void) => eventBus.on(event, handler),
      },
    });
    
    // Build service input from configuration
    const input: MdxServiceInput = {
      docsDir: cfg.mdx.docsDir,
      outputDir: cfg.mdx.outputDir,
      basePath: cfg.mdx.basePath,
      navOutput: cfg.mdx.navOutput,
      components: cfg.mdx.components,
      propsSource: cfg.mdx.propsSource,
      toc: cfg.mdx.toc,
      htmlMode: cfg.html?.mode ?? 'tailwind',
      verbose: true,
      rootDir: cfg.mdx.rootDir,  // For resolving @ alias
    };
    
    logger.info('📚 Generating MDX documentation...');
    
    // Execute service
    const result = await service.execute(input);
    
    // Store result in context for later stages
    context.setData('mdx:result', result);
    
    logger.info(`✅ Generated ${result.pages} documentation pages in ${Math.round(result.duration)}ms`);
    
    // Emit stage completion event
    eventBus.emit('stage:complete', {
      name: this.name,
      result,
    });
    
    return result;
  }
  
  /**
   * Handle stage errors.
   */
  async onError(error: Error, context: IPipelineContext): Promise<void> {
    context.logger.error(`MDX generation failed: ${error.message}`);
  }
}
