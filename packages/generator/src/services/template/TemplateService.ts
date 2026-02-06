/**
 * TemplateService - Generates templates from React components
 *
 * Orchestrates the transformation of React components to template files
 * using the transformer and plugin system.
 */

import { readdir, stat, mkdir, writeFile } from 'node:fs/promises';
import { join, relative, extname, basename } from 'node:path';
import type { IService, IServiceContext } from '../../core/interfaces';
import { transformJsxFile } from '../../transformer';
import type { TransformResult } from '../../transformer';
import {
  PluginRegistry,
  registerBuiltInPlugins,
  type ITemplatePlugin,
  type TemplatePluginConfig,
} from '../../plugins/template';
import type { TemplateOutput } from '../../hast';

// =============================================================================
// Service Types
// =============================================================================

/**
 * Input for TemplateService.execute()
 */
export interface TemplateServiceInput {
  /** Source directories to scan for components */
  sourceDirs: string[];
  
  /** Output directory for generated templates */
  outputDir: string;
  
  /** Template engine to use */
  engine: 'react' | 'liquid' | 'handlebars' | 'twig' | 'latte';
  
  /** File patterns to include (default: all .tsx files) */
  include?: string[];
  
  /** File patterns to exclude */
  exclude?: string[];
  
  /** Plugin configuration */
  pluginConfig?: Partial<TemplatePluginConfig>;
  
  /** Verbose logging */
  verbose?: boolean;
}

/**
 * Output from TemplateService.execute()
 */
export interface TemplateServiceOutput {
  /** Generated template files */
  files: GeneratedFile[];
  
  /** Total components processed */
  componentsProcessed: number;
  
  /** Warnings during generation */
  warnings: string[];
  
  /** Errors during generation */
  errors: string[];
  
  /** Processing duration in ms */
  duration: number;
}

/**
 * Generated file info
 */
export interface GeneratedFile {
  /** Source file path */
  source: string;
  
  /** Output file path */
  output: string;
  
  /** Component name */
  componentName: string;
  
  /** Variables used */
  variables: string[];
  
  /** Dependencies */
  dependencies: string[];
}

// =============================================================================
// Service Implementation
// =============================================================================

export class TemplateService implements IService<TemplateServiceInput, TemplateServiceOutput> {
  readonly name = 'template';
  readonly version = '1.0.0';
  readonly dependencies: readonly string[] = [];
  
  private context!: IServiceContext;
  private registry: PluginRegistry;
  private plugin: ITemplatePlugin | null = null;
  
  constructor() {
    this.registry = new PluginRegistry();
    registerBuiltInPlugins(this.registry);
  }
  
  async initialize(context: IServiceContext): Promise<void> {
    this.context = context;
    this.context.logger.debug('TemplateService initialized');
  }
  
  async execute(input: TemplateServiceInput): Promise<TemplateServiceOutput> {
    const startTime = Date.now();
    const {
      sourceDirs,
      outputDir,
      engine,
      include = ['**/*.tsx'],
      exclude = ['**/*.test.tsx', '**/*.spec.tsx', '**/node_modules/**'],
      pluginConfig = {},
      verbose = false,
    } = input;
    
    const files: GeneratedFile[] = [];
    const warnings: string[] = [];
    const errors: string[] = [];
    let componentsProcessed = 0;
    
    // Initialize plugin
    const config: TemplatePluginConfig = {
      fileExtension: this.getFileExtension(engine),
      outputDir,
      prettyPrint: true,
      ...pluginConfig,
    };
    
    this.plugin = this.registry.get(engine, config);
    await this.plugin.initialize({
      logger: this.context.logger as any,
      config,
      outputDir,
    });
    
    // Ensure output directory exists
    await mkdir(outputDir, { recursive: true });
    
    // Process each source directory
    for (const sourceDir of sourceDirs) {
      try {
        if (verbose) {
          this.context.logger.info(`Scanning: ${sourceDir}`);
        }
        
        const componentFiles = await this.findComponentFiles(sourceDir, include, exclude);
        
        if (verbose) {
          this.context.logger.info(`  Found ${componentFiles.length} files`);
        }
        
        for (const filePath of componentFiles) {
          try {
            if (verbose) {
              this.context.logger.info(`Processing: ${filePath}`);
            }
            
            // Transform JSX to HAST
            const transformResult = await transformJsxFile(filePath);
            
            if (transformResult.errors.length > 0) {
              errors.push(...transformResult.errors.map(e => `${filePath}: ${e}`));
              continue;
            }
            
            warnings.push(...transformResult.warnings.map(w => `${filePath}: ${w}`));
            
            // Skip if no valid tree
            if (transformResult.tree.children.length === 0) {
              if (verbose) {
                this.context.logger.debug(`Skipping empty component: ${filePath}`);
              }
              continue;
            }
            
            // Transform HAST to template
            const templateOutput = await this.plugin.transform(transformResult.tree);
            
            // Write output file
            const outputPath = this.getOutputPath(filePath, sourceDir, outputDir, config.fileExtension);
            await this.writeTemplateFile(outputPath, templateOutput.content);
            
            files.push({
              source: filePath,
              output: outputPath,
              componentName: transformResult.tree.meta?.componentName || 'Unknown',
              variables: templateOutput.variables,
              dependencies: templateOutput.dependencies,
            });
            
            componentsProcessed++;
            
            if (verbose) {
              this.context.logger.info(`Generated: ${outputPath}`);
            }
          } catch (error) {
            errors.push(`${filePath}: ${error instanceof Error ? error.message : String(error)}`);
          }
        }
      } catch (error) {
        errors.push(`${sourceDir}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    
    // Emit event (if eventBus is available)
    if (this.context.eventBus) {
      this.context.eventBus.emit('template:complete', {
        filesGenerated: files.length,
        engine,
        outputDir,
      });
    }
    
    const duration = Date.now() - startTime;
    
    return {
      files,
      componentsProcessed,
      warnings,
      errors,
      duration,
    };
  }
  
  async dispose(): Promise<void> {
    if (this.plugin) {
      await this.plugin.dispose();
      this.plugin = null;
    }
  }
  
  // ===========================================================================
  // Private Methods
  // ===========================================================================
  
  /**
   * Get file extension for engine
   */
  private getFileExtension(engine: string): string {
    const extensions: Record<string, string> = {
      liquid: '.liquid',
      handlebars: '.hbs',
      twig: '.twig',
      latte: '.latte',
    };
    return extensions[engine] || '.html';
  }
  
  /**
   * Find component files matching patterns
   */
  private async findComponentFiles(
    dir: string,
    include: string[],
    exclude: string[]
  ): Promise<string[]> {
    const files: string[] = [];
    
    const walk = async (currentDir: string): Promise<void> => {
      const entries = await readdir(currentDir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(currentDir, entry.name);
        const relativePath = relative(dir, fullPath);
        
        if (entry.isDirectory()) {
          // Check if excluded
          if (!this.matchesPattern(relativePath, exclude)) {
            await walk(fullPath);
          }
        } else if (entry.isFile()) {
          // Check if included and not excluded
          if (
            this.matchesPattern(relativePath, include) &&
            !this.matchesPattern(relativePath, exclude)
          ) {
            files.push(fullPath);
          }
        }
      }
    };
    
    await walk(dir);
    return files;
  }
  
  /**
   * Check if path matches any pattern
   */
  private matchesPattern(path: string, patterns: string[]): boolean {
    for (const pattern of patterns) {
      if (this.simpleMatch(path, pattern)) {
        return true;
      }
    }
    return false;
  }
  
  /**
   * Simple glob-like pattern matching
   */
  private simpleMatch(path: string, pattern: string): boolean {
    // Normalize path separators
    const normalizedPath = path.replace(/\\/g, '/');
    
    // Handle **/ at start - matches any path prefix including none
    let regexPattern = pattern
      .replace(/\\/g, '/')
      .replace(/\./g, '\\.')
      .replace(/\*\*\//g, '(?:.*/)?')  // **/ matches zero or more directories
      .replace(/\*\*/g, '.*')           // ** matches anything
      .replace(/\*/g, '[^/]*');         // * matches non-slash chars
    
    const regex = new RegExp(`^${regexPattern}$`);
    return regex.test(normalizedPath);
  }
  
  /**
   * Get output path for a source file
   */
  private getOutputPath(
    sourcePath: string,
    sourceDir: string,
    outputDir: string,
    extension: string
  ): string {
    const relativePath = relative(sourceDir, sourcePath);
    const baseName = basename(relativePath, extname(relativePath));
    const dir = join(outputDir, relativePath.replace(basename(relativePath), ''));
    return join(dir, baseName + extension);
  }
  
  /**
   * Write template file
   */
  private async writeTemplateFile(path: string, content: string): Promise<void> {
    const dir = join(path, '..');
    await mkdir(dir, { recursive: true });
    await writeFile(path, content, 'utf-8');
  }
}
