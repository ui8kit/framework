import type { IService, IServiceContext } from '../../core/interfaces';
import { join, dirname } from 'node:path';

/**
 * Input for ClassLogService.execute()
 */
export interface ClassLogServiceInput {
  /** Directory containing Liquid view files */
  viewsDir: string;
  /** Output directory for class log files */
  outputDir: string;
  /** Base name for output files (default: 'ui8kit') */
  baseName?: string;
  /** Include responsive variants (md:, lg:, etc.) */
  includeResponsive?: boolean;
  /** Include state variants (hover:, focus:, etc.) */
  includeStates?: boolean;
}

/**
 * Output from ClassLogService.execute()
 */
export interface ClassLogServiceOutput {
  /** Path to generated JSON file */
  jsonPath: string;
  /** Path to generated TXT file (space-separated) */
  txtPath: string;
  /** Path to generated LIST file (newline-separated) */
  listPath: string;
  /** Total number of unique classes */
  totalClasses: number;
}

/**
 * Simplified class log structure (JSON output)
 */
export interface ClassLogFile {
  /** Total unique classes */
  total: number;
  /** Array of all classes (sorted, deduplicated) */
  classes: string[];
}

/**
 * File system interface for ClassLogService
 */
export interface ClassLogFileSystem {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  mkdir(path: string): Promise<void>;
  readdir(path: string): Promise<Array<{ name: string; isFile: () => boolean }>>;
}

/**
 * ClassLogService options
 */
export interface ClassLogServiceOptions {
  /** Custom file system (for testing) */
  fileSystem?: ClassLogFileSystem;
}

/**
 * ClassLogService - Logs all classes used in Liquid views.
 * 
 * Outputs three files:
 * - ui8kit.log.json  - { total: N, classes: [...] }
 * - ui8kit.classes.txt  - space-separated classes (for Tailwind --content)
 * - ui8kit.classes.list - newline-separated classes (one per line)
 * 
 * Usage in generator.config.ts:
 * ```typescript
 * classLog: {
 *   enabled: true,
 *   outputDir: './dist/maps',
 * }
 * ```
 * 
 * Then run Tailwind to filter only valid classes:
 * ```bash
 * npx tailwindcss --content "./dist/maps/ui8kit.classes.txt" -o ./dist/maps/tailwind.css
 * ```
 */
export class ClassLogService implements IService<ClassLogServiceInput, ClassLogServiceOutput> {
  readonly name = 'class-log';
  readonly version = '2.0.0';
  readonly dependencies: readonly string[] = ['view'];
  
  private context!: IServiceContext;
  private fs: ClassLogFileSystem;
  
  constructor(options: ClassLogServiceOptions = {}) {
    this.fs = options.fileSystem ?? this.createDefaultFileSystem();
  }
  
  async initialize(context: IServiceContext): Promise<void> {
    this.context = context;
  }
  
  async execute(input: ClassLogServiceInput): Promise<ClassLogServiceOutput> {
    const { 
      viewsDir, 
      outputDir,
      baseName = 'ui8kit',
      includeResponsive = true, 
      includeStates = true 
    } = input;
    
    this.context.logger.info(`Scanning classes in ${viewsDir}...`);
    
    // Set to collect unique classes
    const classSet = new Set<string>();
    
    // Scan all directories
    const dirsToScan = [
      join(viewsDir, 'pages'),
      join(viewsDir, 'partials'),
      join(viewsDir, 'layouts'),
    ];
    
    for (const dirPath of dirsToScan) {
      await this.scanDirectory(dirPath, classSet, includeResponsive, includeStates);
    }
    
    // Sort classes alphabetically
    const sortedClasses = Array.from(classSet).sort();
    
    // Ensure output directory exists
    await this.fs.mkdir(outputDir);
    
    // Generate file paths
    const jsonPath = join(outputDir, `${baseName}.log.json`);
    const txtPath = join(outputDir, `${baseName}.classes.txt`);
    const listPath = join(outputDir, `${baseName}.classes.list`);
    
    // Write JSON file
    const classLog: ClassLogFile = {
      total: sortedClasses.length,
      classes: sortedClasses,
    };
    await this.fs.writeFile(jsonPath, JSON.stringify(classLog, null, 2));
    
    // Write TXT file (space-separated, single line)
    await this.fs.writeFile(txtPath, sortedClasses.join(' '));
    
    // Write LIST file (newline-separated)
    await this.fs.writeFile(listPath, sortedClasses.join('\n'));
    
    this.context.logger.info(`✅ Generated class logs (${sortedClasses.length} classes):`);
    this.context.logger.info(`   ${jsonPath}`);
    this.context.logger.info(`   ${txtPath}`);
    this.context.logger.info(`   ${listPath}`);
    
    // Emit event
    this.context.eventBus.emit('class-log:generated', {
      jsonPath,
      txtPath,
      listPath,
      totalClasses: sortedClasses.length,
    });
    
    return {
      jsonPath,
      txtPath,
      listPath,
      totalClasses: sortedClasses.length,
    };
  }
  
  async dispose(): Promise<void> {
    // Nothing to dispose
  }
  
  // ===========================================================================
  // Private Methods
  // ===========================================================================
  
  /**
   * Scan directory for Liquid files and extract classes
   */
  private async scanDirectory(
    dirPath: string,
    classSet: Set<string>,
    includeResponsive: boolean,
    includeStates: boolean
  ): Promise<void> {
    try {
      const entries = await this.fs.readdir(dirPath);
      
      for (const entry of entries) {
        if (!entry.isFile()) continue;
        if (!entry.name.toLowerCase().endsWith('.liquid')) continue;
        
        const filePath = join(dirPath, entry.name);
        
        try {
          const content = await this.fs.readFile(filePath);
          this.extractClassesFromHtml(content, classSet, includeResponsive, includeStates);
        } catch (error) {
          this.context.logger.warn(`Failed to read ${filePath}: ${error}`);
        }
      }
    } catch {
      // Directory doesn't exist, skip
    }
  }
  
  /**
   * Extract classes from HTML/Liquid content
   */
  private extractClassesFromHtml(
    html: string,
    classSet: Set<string>,
    includeResponsive: boolean,
    includeStates: boolean
  ): void {
    // Match class attributes (both class="..." and class='...')
    const classRegex = /\bclass\s*=\s*["']([^"']*)["']/gi;
    let match;
    
    while ((match = classRegex.exec(html)) !== null) {
      const classValue = match[1];
      const classes = classValue.split(/\s+/).filter(Boolean);
      
      for (const className of classes) {
        // Skip Liquid tags
        if (className.includes('{') || className.includes('%')) continue;
        
        // Skip empty or whitespace-only
        if (!className.trim()) continue;
        
        // Filter based on options
        if (!includeResponsive && this.isResponsiveClass(className)) continue;
        if (!includeStates && this.isStateClass(className)) continue;
        
        classSet.add(className);
      }
    }
    
    // Also extract from data-class attributes (they become class in semantic mode)
    const dataClassRegex = /\bdata-class\s*=\s*["']([^"']*)["']/gi;
    
    while ((match = dataClassRegex.exec(html)) !== null) {
      const dataClassValue = match[1].trim();
      if (!dataClassValue) continue;
      
      classSet.add(dataClassValue);
    }
  }
  
  /**
   * Check if class is a responsive variant (md:, lg:, etc.)
   */
  private isResponsiveClass(className: string): boolean {
    return /^(sm|md|lg|xl|2xl):/.test(className);
  }
  
  /**
   * Check if class is a state variant (hover:, focus:, etc.)
   */
  private isStateClass(className: string): boolean {
    return /^(hover|focus|active|visited|disabled|group-hover|peer-hover):/.test(className);
  }
  
  /**
   * Create default file system using Node.js fs
   */
  private createDefaultFileSystem(): ClassLogFileSystem {
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
}
