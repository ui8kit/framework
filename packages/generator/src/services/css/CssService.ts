import type { IService, IServiceContext, RouteConfig } from '../../core/interfaces';
import type { HtmlConverterService, HtmlConverterOutput } from '../html-converter';
import { join } from 'node:path';

/**
 * CSS output file names configuration
 */
export interface CssOutputFileNames {
  /** Tailwind @apply CSS file name (default: 'tailwind.apply.css') */
  applyCss?: string;
  /** Pure CSS file name (default: 'ui8kit.local.css') */
  pureCss?: string;
}

/**
 * Default CSS output file names
 */
const DEFAULT_CSS_OUTPUT_FILES: Required<CssOutputFileNames> = {
  applyCss: 'tailwind.apply.css',
  pureCss: 'ui8kit.local.css',
};

/**
 * Input for CssService.execute()
 */
export interface CssServiceInput {
  viewsDir: string;
  outputDir: string;
  routes: Record<string, RouteConfig>;
  pureCss?: boolean;
  mappings?: {
    ui8kitMap?: string;
    shadcnMap?: string;
  };
  /** Output file names configuration */
  outputFiles?: CssOutputFileNames;
}

/**
 * Output from CssService.execute()
 */
export interface CssServiceOutput {
  files: Array<{
    path: string;
    size: number;
    type: 'apply' | 'pure' | 'variants';
  }>;
}

/**
 * File system interface for CssService
 */
export interface CssFileSystem {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  mkdir(path: string): Promise<void>;
  readdir(path: string): Promise<Array<{ name: string; isFile: () => boolean }>>;
}

/**
 * CSS converter interface (legacy, for backward compatibility)
 */
export interface CssConverter {
  convertHtmlToCss(
    htmlFilePath: string,
    outputApplyCss: string,
    outputPureCss: string,
    options?: {
      verbose?: boolean;
      ui8kitMapPath?: string;
      shadcnMapPath?: string;
    }
  ): Promise<{ applyCss: string; pureCss: string }>;
}

/**
 * Converter mode: 'service' uses HtmlConverterService, 'legacy' uses old converter
 */
export type ConverterMode = 'service' | 'legacy';

/**
 * CssService options
 */
export interface CssServiceOptions {
  fileSystem?: CssFileSystem;
  /** Legacy converter (deprecated, use converterMode: 'service' instead) */
  converter?: CssConverter;
  /** Converter mode: 'service' (recommended) or 'legacy' (default for backward compatibility) */
  converterMode?: ConverterMode;
}

/**
 * CssService - Generates CSS from Liquid view files.
 * 
 * Responsibilities:
 * - Extract classes from HTML views
 * - Generate @apply CSS (tailwind.apply.css)
 * - Generate pure CSS3 (ui8kit.local.css)
 * - Merge CSS from multiple routes
 */
export class CssService implements IService<CssServiceInput, CssServiceOutput> {
  readonly name = 'css';
  readonly version = '1.0.0';
  readonly dependencies: readonly string[] = ['view'];
  
  private context!: IServiceContext;
  private fs: CssFileSystem;
  private converter: CssConverter | null;
  private converterMode: ConverterMode;
  private htmlConverterService: HtmlConverterService | null = null;
  
  constructor(options: CssServiceOptions = {}) {
    this.fs = options.fileSystem ?? this.createDefaultFileSystem();
    this.converterMode = options.converterMode ?? 'legacy';
    this.converter = options.converter ?? (this.converterMode === 'legacy' ? this.createDefaultConverter() : null);
  }
  
  async initialize(context: IServiceContext): Promise<void> {
    this.context = context;
    
    // Try to get HtmlConverterService from registry if in service mode
    if (this.converterMode === 'service') {
      try {
        // Registry is available on context via eventBus or direct injection
        const registry = (context as any).registry;
        if (registry?.has('html-converter')) {
          this.htmlConverterService = registry.resolve('html-converter');
        }
      } catch {
        this.context.logger.debug('HtmlConverterService not found in registry, using legacy converter');
        this.converter = this.createDefaultConverter();
      }
    }
  }
  
  async execute(input: CssServiceInput): Promise<CssServiceOutput> {
    const { viewsDir, outputDir, routes, pureCss = false, mappings, outputFiles = {} } = input;
    
    // Merge with defaults
    const cssFileNames: Required<CssOutputFileNames> = { ...DEFAULT_CSS_OUTPUT_FILES, ...outputFiles };
    
    // Ensure output directory exists
    await this.fs.mkdir(outputDir);
    
    const allApplyCss: string[] = [];
    const allPureCss: string[] = [];
    const generatedFiles: CssServiceOutput['files'] = [];
    
    // Process page views for each route
    for (const routePath of Object.keys(routes)) {
      const viewFileName = this.routeToViewFileName(routePath);
      const viewPath = join(viewsDir, 'pages', viewFileName);
      
      try {
        const result = await this.convertHtml(viewPath, cssFileNames, mappings);
        
        allApplyCss.push(result.applyCss);
        if (pureCss) {
          allPureCss.push(result.pureCss);
        }
        
        this.context.logger.debug(`Processed CSS for route: ${routePath}`);
      } catch (error) {
        this.context.logger.warn(`Failed to process CSS for ${routePath}:`, error);
      }
    }
    
    // Process partials and layouts directories
    const extraDirs = [
      join(viewsDir, 'partials'),
      join(viewsDir, 'layouts'),
    ];
    
    for (const dirPath of extraDirs) {
      try {
        const entries = await this.fs.readdir(dirPath);
        
        for (const entry of entries) {
          if (!entry.isFile()) continue;
          if (!entry.name.toLowerCase().endsWith('.liquid')) continue;
          
          const filePath = join(dirPath, entry.name);
          
          try {
            const result = await this.convertHtml(filePath, cssFileNames, mappings);
            
            allApplyCss.push(result.applyCss);
            if (pureCss) {
              allPureCss.push(result.pureCss);
            }
            
            this.context.logger.debug(`Processed CSS for template: ${filePath}`);
          } catch (error) {
            this.context.logger.warn(`Failed to process CSS for ${filePath}:`, error);
          }
        }
      } catch {
        // Directory doesn't exist, skip
      }
    }
    
    // Merge and write apply CSS
    const mergedApplyCss = this.mergeCssFiles(allApplyCss.filter(Boolean));
    const applyCssPath = join(outputDir, cssFileNames.applyCss);
    await this.fs.writeFile(applyCssPath, mergedApplyCss);
    
    generatedFiles.push({
      path: applyCssPath,
      size: mergedApplyCss.length,
      type: 'apply',
    });
    
    this.context.eventBus.emit('css:generated', {
      path: applyCssPath,
      size: mergedApplyCss.length,
    });
    
    this.context.logger.info(`Generated ${applyCssPath} (${mergedApplyCss.length} bytes)`);
    
    // Write pure CSS if enabled
    if (pureCss) {
      const mergedPureCss = this.mergeCssFiles(allPureCss.filter(Boolean));
      const pureCssPath = join(outputDir, cssFileNames.pureCss);
      await this.fs.writeFile(pureCssPath, mergedPureCss);
      
      generatedFiles.push({
        path: pureCssPath,
        size: mergedPureCss.length,
        type: 'pure',
      });
      
      this.context.eventBus.emit('css:generated', {
        path: pureCssPath,
        size: mergedPureCss.length,
      });
      
      this.context.logger.info(`Generated ${pureCssPath} (${mergedPureCss.length} bytes)`);
    }
    
    return { files: generatedFiles };
  }
  
  async dispose(): Promise<void> {
    // No cleanup needed
  }
  
  /**
   * Convert HTML file using appropriate converter
   */
  private async convertHtml(
    htmlPath: string,
    cssFileNames: Required<CssOutputFileNames>,
    mappings?: { ui8kitMap?: string; shadcnMap?: string }
  ): Promise<{ applyCss: string; pureCss: string }> {
    // Use HtmlConverterService if available
    if (this.htmlConverterService) {
      const result = await this.htmlConverterService.execute({
        htmlPath,
        verbose: false,
      });
      return {
        applyCss: result.applyCss,
        pureCss: result.pureCss,
      };
    }
    
    // Fall back to legacy converter
    if (!this.converter) {
      this.converter = this.createDefaultConverter();
    }
    
    return this.converter.convertHtmlToCss(
      htmlPath,
      cssFileNames.applyCss,
      cssFileNames.pureCss,
      {
        verbose: false,
        ui8kitMapPath: mappings?.ui8kitMap,
        shadcnMapPath: mappings?.shadcnMap,
      }
    );
  }
  
  /**
   * Convert route path to view file name
   */
  private routeToViewFileName(routePath: string): string {
    if (routePath === '/') {
      return 'index.liquid';
    }
    return `${routePath.slice(1)}.liquid`;
  }
  
  /**
   * Merge multiple CSS files
   */
  private mergeCssFiles(cssFiles: string[]): string {
    if (cssFiles.length === 0) return '';
    if (cssFiles.length === 1) return cssFiles[0];
    
    // Concatenate with route separators
    const merged = cssFiles.join('\n\n/* === Next Source === */\n\n');
    
    // Update timestamp in header
    return merged.replace(
      /Generated on: .*/,
      `Generated on: ${new Date().toISOString()}`
    );
  }
  
  /**
   * Create default file system using Node.js fs
   */
  private createDefaultFileSystem(): CssFileSystem {
    return {
      readFile: async (path: string) => {
        const { readFile } = await import('node:fs/promises');
        return readFile(path, 'utf-8');
      },
      writeFile: async (path: string, content: string) => {
        const { writeFile } = await import('node:fs/promises');
        await writeFile(path, content, 'utf-8');
      },
      mkdir: async (path: string) => {
        const { mkdir } = await import('node:fs/promises');
        await mkdir(path, { recursive: true });
      },
      readdir: async (path: string) => {
        const { readdir } = await import('node:fs/promises');
        const entries = await readdir(path, { withFileTypes: true });
        return entries.map(e => ({
          name: e.name,
          isFile: () => e.isFile(),
        }));
      },
    };
  }
  
  /**
   * Create default converter using html-converter
   */
  private createDefaultConverter(): CssConverter {
    return {
      convertHtmlToCss: async (htmlFilePath, outputApplyCss, outputPureCss, options) => {
        const { htmlConverter } = await import('../../html-converter.js');
        return htmlConverter.convertHtmlToCss(htmlFilePath, outputApplyCss, outputPureCss, options);
      },
    };
  }
}
