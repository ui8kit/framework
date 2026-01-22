import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CssService } from './CssService';
import type { IServiceContext, GeneratorConfig } from '../../core/interfaces';
import { createMockFileSystem, createMockLogger } from '../../../test/setup';

// Mock context factory
function createMockContext(config: Partial<GeneratorConfig> = {}): IServiceContext {
  const fullConfig: GeneratorConfig = {
    app: { name: 'Test', lang: 'en' },
    mappings: {
      ui8kitMap: './src/lib/ui8kit.map.json',
    },
    css: {
      entryPath: './src/main.tsx',
      routes: ['/'],
      outputDir: './dist/css',
      pureCss: true,
    },
    html: {
      viewsDir: './views',
      routes: { '/': { title: 'Home' } },
      outputDir: './dist/html',
    },
    ...config,
  };
  
  return {
    config: fullConfig,
    logger: createMockLogger(),
    eventBus: {
      emit: vi.fn(),
      on: vi.fn().mockReturnValue(() => {}),
      once: vi.fn(),
      off: vi.fn(),
      removeAllListeners: vi.fn(),
      listenerCount: vi.fn().mockReturnValue(0),
    },
    registry: {
      has: vi.fn().mockReturnValue(false),
      resolve: vi.fn(),
      register: vi.fn(),
      getServiceNames: vi.fn().mockReturnValue([]),
      getInitializationOrder: vi.fn().mockReturnValue([]),
      initializeAll: vi.fn().mockResolvedValue(undefined),
      disposeAll: vi.fn().mockResolvedValue(undefined),
    },
  };
}

describe('CssService', () => {
  let service: CssService;
  let mockFs: ReturnType<typeof createMockFileSystem>;
  let mockConverter: {
    convertHtmlToCss: ReturnType<typeof vi.fn>;
  };
  
  beforeEach(() => {
    mockFs = createMockFileSystem();
    mockConverter = {
      convertHtmlToCss: vi.fn().mockResolvedValue({
        applyCss: '.test { @apply bg-red-500; }',
        pureCss: '.test { background-color: red; }',
      }),
    };
    
    // Set up view files
    mockFs.files.set('./views/pages/index.liquid', '<div class="bg-red-500" data-class="test">Hello</div>');
    
    service = new CssService({
      fileSystem: {
        readFile: mockFs.readFile,
        writeFile: mockFs.writeFile,
        mkdir: mockFs.mkdir,
        readdir: mockFs.readdir,
      },
      converter: mockConverter,
    });
  });
  
  describe('metadata', () => {
    it('should have correct name', () => {
      expect(service.name).toBe('css');
    });
    
    it('should have version', () => {
      expect(service.version).toMatch(/^\d+\.\d+\.\d+$/);
    });
    
    it('should depend on view service', () => {
      expect(service.dependencies).toContain('view');
    });
  });
  
  describe('initialize', () => {
    it('should initialize without error', async () => {
      const context = createMockContext();
      
      await expect(service.initialize(context)).resolves.not.toThrow();
    });
  });
  
  describe('execute', () => {
    beforeEach(async () => {
      await service.initialize(createMockContext());
    });
    
    it('should create output directory', async () => {
      const input = {
        viewsDir: './views',
        outputDir: './dist/css',
        routes: { '/': { title: 'Home' } },
        pureCss: true,
      };
      
      await service.execute(input);
      
      expect(mockFs.mkdir).toHaveBeenCalledWith('./dist/css');
    });
    
    it('should process each route view file', async () => {
      mockFs.files.set('./views/pages/index.liquid', '<div class="test">Home</div>');
      mockFs.files.set('./views/pages/about.liquid', '<div class="test">About</div>');
      
      const input = {
        viewsDir: './views',
        outputDir: './dist/css',
        routes: {
          '/': { title: 'Home' },
          '/about': { title: 'About' },
        },
        pureCss: true,
      };
      
      await service.execute(input);
      
      expect(mockConverter.convertHtmlToCss).toHaveBeenCalledTimes(2);
    });
    
    it('should generate tailwind.apply.css', async () => {
      const input = {
        viewsDir: './views',
        outputDir: './dist/css',
        routes: { '/': { title: 'Home' } },
        pureCss: false,
      };
      
      await service.execute(input);
      
      // Normalize paths for cross-platform
      const writeCalls = mockFs.writeFile.mock.calls.map(call => 
        [(call[0] as string).replace(/\\/g, '/'), call[1]]
      );
      
      expect(writeCalls).toContainEqual([
        expect.stringContaining('tailwind.apply.css'),
        expect.any(String)
      ]);
    });
    
    it('should generate ui8kit.local.css when pureCss is true', async () => {
      const input = {
        viewsDir: './views',
        outputDir: './dist/css',
        routes: { '/': { title: 'Home' } },
        pureCss: true,
      };
      
      await service.execute(input);
      
      // Normalize paths for cross-platform
      const writeCalls = mockFs.writeFile.mock.calls.map(call => 
        [(call[0] as string).replace(/\\/g, '/'), call[1]]
      );
      
      expect(writeCalls).toContainEqual([
        expect.stringContaining('ui8kit.local.css'),
        expect.any(String)
      ]);
    });
    
    it('should emit css:generated event', async () => {
      const context = createMockContext();
      await service.initialize(context);
      
      const input = {
        viewsDir: './views',
        outputDir: './dist/css',
        routes: { '/': { title: 'Home' } },
        pureCss: true,
      };
      
      await service.execute(input);
      
      expect(context.eventBus.emit).toHaveBeenCalledWith(
        'css:generated',
        expect.objectContaining({
          path: expect.any(String),
          size: expect.any(Number),
        })
      );
    });
    
    it('should return generated file info', async () => {
      const input = {
        viewsDir: './views',
        outputDir: './dist/css',
        routes: { '/': { title: 'Home' } },
        pureCss: true,
      };
      
      const result = await service.execute(input);
      
      expect(result.files).toContainEqual(
        expect.objectContaining({
          path: expect.stringContaining('tailwind.apply.css'),
          size: expect.any(Number),
        })
      );
    });
    
    it('should also process partials and layouts directories', async () => {
      // Mock readdir to return file entries for partials/layouts
      const originalReaddir = mockFs.readdir;
      mockFs.readdir = vi.fn().mockImplementation(async (path: string) => {
        const normalized = path.replace(/\\/g, '/');
        if (normalized.includes('partials')) {
          return [{ name: 'header.liquid', isFile: () => true }];
        }
        if (normalized.includes('layouts')) {
          return [{ name: 'layout.liquid', isFile: () => true }];
        }
        return [];
      });
      
      mockFs.files.set('./views/partials/header.liquid', '<header class="header">Header</header>');
      mockFs.files.set('./views/layouts/layout.liquid', '<html class="layout">Layout</html>');
      
      const input = {
        viewsDir: './views',
        outputDir: './dist/css',
        routes: { '/': { title: 'Home' } },
        pureCss: true,
      };
      
      // Re-create service with updated mock
      service = new CssService({
        fileSystem: {
          readFile: mockFs.readFile,
          writeFile: mockFs.writeFile,
          mkdir: mockFs.mkdir,
          readdir: mockFs.readdir,
        },
        converter: mockConverter,
      });
      await service.initialize(createMockContext());
      
      await service.execute(input);
      
      // Should process pages + partials + layouts (3 total)
      expect(mockConverter.convertHtmlToCss.mock.calls.length).toBeGreaterThanOrEqual(3);
    });
  });
  
  describe('dispose', () => {
    it('should dispose without error', async () => {
      await service.initialize(createMockContext());
      
      await expect(service.dispose()).resolves.not.toThrow();
    });
  });
});
