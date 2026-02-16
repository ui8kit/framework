import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MdxStage, type IMdxService, type MdxServiceOutput } from './MdxStage';
import type { IPipelineContext } from '../core/interfaces';
import { createMockLogger } from '../../test/setup';

// =============================================================================
// Mock MdxService
// =============================================================================

/**
 * Create a mock MdxService for testing
 */
function createMockMdxService(): IMdxService & { 
  initialize: ReturnType<typeof vi.fn>;
  execute: ReturnType<typeof vi.fn>;
  dispose: ReturnType<typeof vi.fn>;
} {
  const mockResult: MdxServiceOutput = {
    pages: 3,
    navigation: [
      { title: 'Home', path: '/', order: 1 },
      { title: 'Guide', path: '/guide', order: 2 },
    ],
    generatedPages: [
      { urlPath: '/', outputPath: './dist/html/index.html', title: 'Home' },
      { urlPath: '/guide', outputPath: './dist/html/guide/index.html', title: 'Guide' },
      { urlPath: '/api', outputPath: './dist/html/api/index.html', title: 'API' },
    ],
    duration: 150,
  };

  return {
    name: 'MdxService',
    version: '1.0.0',
    initialize: vi.fn().mockResolvedValue(undefined),
    execute: vi.fn().mockResolvedValue(mockResult),
    dispose: vi.fn().mockResolvedValue(undefined),
  };
}

// =============================================================================
// Test Utilities
// =============================================================================

/**
 * Create a mock pipeline context
 */
function createMockContext(overrides: Partial<{
  mdx: any;
  html: any;
}> = {}): IPipelineContext {
  const data = new Map<string, unknown>();
  const results = new Map();
  
  return {
    config: {
      app: { name: 'Test' },
      css: { entryPath: './src/main.tsx', routes: ['/'], outputDir: './dist/css' },
      html: {
        viewsDir: './views',
        routes: {},
        outputDir: './dist/html',
        mode: 'tailwind',
        ...overrides.html,
      },
      mdx: {
        enabled: true,
        docsDir: './docs',
        outputDir: './dist/html',
        basePath: '/docs',
        navOutput: './dist/docs-nav.json',
        ...overrides.mdx,
      },
    },
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
    data,
    results,
    setData: <T>(key: string, value: T) => data.set(key, value),
    getData: <T>(key: string) => data.get(key) as T | undefined,
  };
}

// =============================================================================
// Tests
// =============================================================================

describe('MdxStage', () => {
  let stage: MdxStage;
  let mockService: ReturnType<typeof createMockMdxService>;
  
  beforeEach(() => {
    vi.clearAllMocks();
    mockService = createMockMdxService();
    stage = new MdxStage(mockService);
  });
  
  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  // ===========================================================================
  // Metadata Tests
  // ===========================================================================
  
  describe('metadata', () => {
    it('should have correct name', () => {
      expect(stage.name).toBe('mdx');
    });
    
    it('should have order after html stage', () => {
      expect(stage.order).toBe(60);
    });
    
    it('should be enabled by default', () => {
      expect(stage.enabled).toBe(true);
    });
    
    it('should depend on html stage', () => {
      expect(stage.dependencies).toContain('html');
    });
    
    it('should have description', () => {
      expect(stage.description).toBeDefined();
      expect(stage.description).toContain('MDX');
    });
  });
  
  // ===========================================================================
  // canExecute Tests
  // ===========================================================================
  
  describe('canExecute', () => {
    it('should return true when mdx.enabled is true', () => {
      const context = createMockContext({ mdx: { enabled: true } });
      
      expect(stage.canExecute(context)).toBe(true);
    });
    
    it('should return false when mdx.enabled is false', () => {
      const context = createMockContext({ mdx: { enabled: false } });
      
      expect(stage.canExecute(context)).toBe(false);
    });
    
    it('should return false when mdx is not configured', () => {
      const context = createMockContext();
      (context.config as any).mdx = undefined;
      
      expect(stage.canExecute(context)).toBe(false);
    });
    
    it('should return false when config is empty', () => {
      const context = createMockContext();
      (context.config as any).mdx = {};
      
      expect(stage.canExecute(context)).toBe(false);
    });
  });
  
  // ===========================================================================
  // execute Tests
  // ===========================================================================
  
  describe('execute', () => {
    it('should initialize MdxService with context', async () => {
      const context = createMockContext();
      
      await stage.execute(undefined as any, context);
      
      // Service should be initialized
      expect(mockService.initialize).toHaveBeenCalled();
      expect(context.logger.info).toHaveBeenCalled();
    });
    
    it('should pass correct input to service', async () => {
      const context = createMockContext({
        mdx: {
          enabled: true,
          docsDir: './custom/docs',
          outputDir: './custom/output',
          basePath: '/api',
          navOutput: './nav.json',
          components: { Button: './Button' },
          toc: { minLevel: 2, maxLevel: 4 },
        },
        html: { mode: 'semantic' },
      });
      
      await stage.execute(undefined as any, context);
      
      // Should call service.execute with correct input
      expect(mockService.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          docsDir: './custom/docs',
          outputDir: './custom/output',
          basePath: '/api',
          navOutput: './nav.json',
          htmlMode: 'semantic',
        })
      );
      
      // Should log start message
      expect(context.logger.info).toHaveBeenCalledWith(
        expect.stringContaining('MDX documentation')
      );
    });
    
    it('should return service result', async () => {
      const context = createMockContext();
      
      const result = await stage.execute(undefined as any, context);
      
      expect(result.pages).toBe(3);
      expect(result.navigation).toHaveLength(2);
      expect(result.duration).toBeGreaterThanOrEqual(0);
    });
    
    it('should store result in context data', async () => {
      const context = createMockContext();
      
      await stage.execute(undefined as any, context);
      
      const storedResult = context.getData('mdx:result');
      expect(storedResult).toBeDefined();
      expect((storedResult as any).pages).toBe(3);
    });
    
    it('should emit stage:complete event', async () => {
      const context = createMockContext();
      
      await stage.execute(undefined as any, context);
      
      expect(context.eventBus.emit).toHaveBeenCalledWith(
        'stage:complete',
        expect.objectContaining({
          name: 'mdx',
          result: expect.objectContaining({
            pages: expect.any(Number),
          }),
        })
      );
    });
    
    it('should log completion message', async () => {
      const context = createMockContext();
      
      await stage.execute(undefined as any, context);
      
      expect(context.logger.info).toHaveBeenCalledWith(
        expect.stringContaining('Generated 3 documentation pages')
      );
    });
    
    it('should use tailwind mode by default', async () => {
      const context = createMockContext();
      delete (context.config as any).html.mode;
      
      await stage.execute(undefined as any, context);
      
      // Should not throw and should complete
      expect(context.logger.info).toHaveBeenCalled();
    });
  });
  
  // ===========================================================================
  // onError Tests
  // ===========================================================================
  
  describe('onError', () => {
    it('should log error message', async () => {
      const context = createMockContext();
      const error = new Error('Test MDX error');
      
      await stage.onError(error, context);
      
      expect(context.logger.error).toHaveBeenCalledWith(
        expect.stringContaining('MDX generation failed')
      );
      expect(context.logger.error).toHaveBeenCalledWith(
        expect.stringContaining('Test MDX error')
      );
    });
  });
  
  // ===========================================================================
  // Integration Tests
  // ===========================================================================
  
  describe('integration', () => {
    it('should work with full configuration', async () => {
      const context = createMockContext({
        mdx: {
          enabled: true,
          docsDir: './docs',
          outputDir: './dist/html',
          basePath: '/docs',
          navOutput: './dist/docs-nav.json',
          components: {
            Button: '@/components/Button',
            Card: '@/components/Card',
          },
          propsSource: './src/components',
          toc: {
            minLevel: 2,
            maxLevel: 3,
          },
        },
        html: { mode: 'tailwind' },
      });
      
      // Should execute without errors
      const result = await stage.execute(undefined as any, context);
      
      expect(result.pages).toBeGreaterThan(0);
      expect(result.navigation).toBeDefined();
      expect(result.generatedPages).toBeDefined();
    });
    
    it('should handle minimal configuration', async () => {
      const context = createMockContext({
        mdx: {
          enabled: true,
          docsDir: './docs',
          outputDir: './dist',
        },
      });
      
      const result = await stage.execute(undefined as any, context);
      
      expect(result).toBeDefined();
      expect(result.pages).toBeGreaterThanOrEqual(0);
    });
  });
});
