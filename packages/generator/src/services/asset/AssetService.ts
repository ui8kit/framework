import type { IService, IServiceContext } from '../../core/interfaces';
import { join, basename, dirname, relative } from 'node:path';

/**
 * Input for AssetService.execute()
 */
export interface AssetServiceInput {
  /** Source CSS directory */
  cssSourceDir: string;
  /** Source JS directory (optional) */
  jsSourceDir?: string;
  /** Public assets directory (images, fonts) */
  publicDir?: string;
  /** Output assets directory */
  outputDir: string;
  /** CSS mode: 'tailwind' | 'semantic' */
  cssMode?: 'tailwind' | 'semantic';
}

/**
 * Output from AssetService.execute()
 */
export interface AssetServiceOutput {
  copiedFiles: Array<{
    source: string;
    dest: string;
    size: number;
    type: 'css' | 'js' | 'image' | 'font' | 'other';
  }>;
  totalSize: number;
}

/**
 * File system interface for AssetService
 */
export interface AssetFileSystem {
  copyFile(src: string, dest: string): Promise<void>;
  mkdir(path: string): Promise<void>;
  readdir(path: string, options?: { recursive?: boolean }): Promise<string[]>;
  stat(path: string): Promise<{ size: number; isFile(): boolean; isDirectory(): boolean }>;
  exists(path: string): Promise<boolean>;
}

/**
 * AssetService options
 */
export interface AssetServiceOptions {
  fileSystem?: AssetFileSystem;
}

/**
 * AssetService - Manages static asset copying and organization.
 * 
 * Responsibilities:
 * - Copy CSS files to output
 * - Copy JS files to output
 * - Copy public assets (images, fonts)
 * - Maintain directory structure
 */
export class AssetService implements IService<AssetServiceInput, AssetServiceOutput> {
  readonly name = 'asset';
  readonly version = '1.0.0';
  readonly dependencies: readonly string[] = ['html'];
  
  private context!: IServiceContext;
  private fs: AssetFileSystem;
  
  constructor(options: AssetServiceOptions = {}) {
    this.fs = options.fileSystem ?? this.createDefaultFileSystem();
  }
  
  async initialize(context: IServiceContext): Promise<void> {
    this.context = context;
  }
  
  async execute(input: AssetServiceInput): Promise<AssetServiceOutput> {
    const {
      cssSourceDir,
      jsSourceDir,
      publicDir,
      outputDir,
      cssMode = 'tailwind',
    } = input;
    
    const copiedFiles: AssetServiceOutput['copiedFiles'] = [];
    let totalSize = 0;
    
    // Ensure output directories exist
    const cssOutputDir = join(outputDir, 'css');
    const jsOutputDir = join(outputDir, 'js');
    
    await this.fs.mkdir(cssOutputDir);
    if (jsSourceDir) {
      await this.fs.mkdir(jsOutputDir);
    }
    
    // Copy CSS files
    try {
      const cssFiles = await this.getCssFilesToCopy(cssSourceDir, cssMode);
      
      for (const file of cssFiles) {
        const srcPath = join(cssSourceDir, file);
        const destPath = join(cssOutputDir, file);
        
        await this.fs.mkdir(dirname(destPath));
        await this.fs.copyFile(srcPath, destPath);
        
        const stat = await this.fs.stat(srcPath);
        
        copiedFiles.push({
          source: srcPath,
          dest: destPath,
          size: stat.size,
          type: 'css',
        });
        
        totalSize += stat.size;
        
        this.context.eventBus.emit('asset:copied', {
          source: srcPath,
          dest: destPath,
          type: 'css',
        });
        
        this.context.logger.debug(`Copied CSS: ${srcPath} -> ${destPath}`);
      }
    } catch (error) {
      this.context.logger.warn(`Failed to copy CSS files:`, error);
    }
    
    // Copy JS files
    if (jsSourceDir) {
      try {
        const jsExists = await this.fs.exists(jsSourceDir);
        if (jsExists) {
          const jsFiles = await this.fs.readdir(jsSourceDir);
          
          for (const file of jsFiles) {
            if (!file.endsWith('.js') && !file.endsWith('.mjs')) continue;
            
            const srcPath = join(jsSourceDir, file);
            const destPath = join(jsOutputDir, file);
            
            await this.fs.copyFile(srcPath, destPath);
            
            const stat = await this.fs.stat(srcPath);
            
            copiedFiles.push({
              source: srcPath,
              dest: destPath,
              size: stat.size,
              type: 'js',
            });
            
            totalSize += stat.size;
            
            this.context.eventBus.emit('asset:copied', {
              source: srcPath,
              dest: destPath,
              type: 'js',
            });
            
            this.context.logger.debug(`Copied JS: ${srcPath} -> ${destPath}`);
          }
        }
      } catch (error) {
        this.context.logger.warn(`Failed to copy JS files:`, error);
      }
    }
    
    // Copy public assets
    if (publicDir) {
      const publicOutput = join(outputDir, 'assets');
      await this.fs.mkdir(publicOutput);
      
      const publicCopied = await this.copyDirectory(publicDir, publicOutput);
      copiedFiles.push(...publicCopied);
      totalSize += publicCopied.reduce((sum, f) => sum + f.size, 0);
    }
    
    this.context.logger.info(`Copied ${copiedFiles.length} assets (${this.formatSize(totalSize)})`);
    
    return { copiedFiles, totalSize };
  }
  
  async dispose(): Promise<void> {
    // No cleanup needed
  }
  
  /**
   * Get CSS files to copy based on mode
   */
  private async getCssFilesToCopy(cssDir: string, mode: 'tailwind' | 'semantic'): Promise<string[]> {
    const files = await this.fs.readdir(cssDir);
    
    return files.filter(file => {
      if (!file.endsWith('.css')) return false;
      
      // Always include these
      if (file === 'shadcn.css' || file === 'variants.apply.css') {
        return true;
      }
      
      // Mode-specific files
      if (mode === 'tailwind') {
        return file === 'tailwind.apply.css';
      } else {
        return file === 'ui8kit.local.css';
      }
    });
  }
  
  /**
   * Recursively copy a directory
   */
  private async copyDirectory(
    srcDir: string,
    destDir: string
  ): Promise<AssetServiceOutput['copiedFiles']> {
    const copied: AssetServiceOutput['copiedFiles'] = [];
    
    try {
      const entries = await this.fs.readdir(srcDir, { recursive: true });
      
      for (const entry of entries) {
        const srcPath = join(srcDir, entry);
        const destPath = join(destDir, entry);
        
        try {
          const stat = await this.fs.stat(srcPath);
          
          if (stat.isDirectory()) {
            await this.fs.mkdir(destPath);
            continue;
          }
          
          await this.fs.mkdir(dirname(destPath));
          await this.fs.copyFile(srcPath, destPath);
          
          copied.push({
            source: srcPath,
            dest: destPath,
            size: stat.size,
            type: this.getAssetType(entry),
          });
          
          this.context.eventBus.emit('asset:copied', {
            source: srcPath,
            dest: destPath,
            type: this.getAssetType(entry),
          });
          
          this.context.logger.debug(`Copied asset: ${srcPath} -> ${destPath}`);
        } catch (error) {
          this.context.logger.warn(`Failed to copy ${srcPath}:`, error);
        }
      }
    } catch (error) {
      this.context.logger.warn(`Failed to read directory ${srcDir}:`, error);
    }
    
    return copied;
  }
  
  /**
   * Determine asset type from file path
   */
  private getAssetType(filePath: string): 'css' | 'js' | 'image' | 'font' | 'other' {
    const ext = filePath.toLowerCase().split('.').pop() ?? '';
    
    if (ext === 'css') return 'css';
    if (ext === 'js' || ext === 'mjs') return 'js';
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'ico'].includes(ext)) return 'image';
    if (['woff', 'woff2', 'ttf', 'otf', 'eot'].includes(ext)) return 'font';
    
    return 'other';
  }
  
  /**
   * Format file size for logging
   */
  private formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  }
  
  /**
   * Create default file system
   */
  private createDefaultFileSystem(): AssetFileSystem {
    return {
      copyFile: async (src: string, dest: string) => {
        const { copyFile } = await import('node:fs/promises');
        await copyFile(src, dest);
      },
      mkdir: async (path: string) => {
        const { mkdir } = await import('node:fs/promises');
        await mkdir(path, { recursive: true });
      },
      readdir: async (path: string, options?: { recursive?: boolean }) => {
        const { readdir } = await import('node:fs/promises');
        const entries = await readdir(path, { withFileTypes: true, recursive: options?.recursive });
        return entries.map(e => {
          if (typeof e === 'string') return e;
          return e.name;
        });
      },
      stat: async (path: string) => {
        const { stat } = await import('node:fs/promises');
        return stat(path);
      },
      exists: async (path: string) => {
        const { access } = await import('node:fs/promises');
        try {
          await access(path);
          return true;
        } catch {
          return false;
        }
      },
    };
  }
}
