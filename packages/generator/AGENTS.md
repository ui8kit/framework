# @ui8kit/generator — Agent Development Guide

Instructions for AI coding agents working with the generator package.

---

## Overview

The `@ui8kit/generator` package is a **service-based static site generator** that converts React components to semantic HTML with optimized CSS. It follows SOLID principles with dependency injection, event-driven architecture, and comprehensive test coverage.

## Architecture Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│                         Orchestrator                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌───────────────────────────┐   │
│  │   Logger    │  │  EventBus   │  │    ServiceRegistry        │   │
│  └─────────────┘  └─────────────┘  └───────────────────────────┘   │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                        Pipeline                             │    │
│  │  Layout → View → CSS → HTML → Asset → ViteBundle → MDX     │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                        Services                             │    │
│  │  LayoutService, RenderService, ViewService, CssService,    │    │
│  │  HtmlService, AssetService, HtmlConverterService,          │    │
│  │  ViteBundleService, MdxService                             │    │
│  └────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
packages/generator/
├── src/
│   ├── core/                    # Core infrastructure
│   │   ├── interfaces/          # TypeScript interfaces (IService, IPipeline, etc.)
│   │   ├── orchestrator/        # Main coordinator
│   │   ├── pipeline/            # Stage execution engine
│   │   ├── registry/            # Service dependency injection
│   │   ├── events/              # Pub/sub event bus
│   │   └── logger/              # Logging infrastructure
│   ├── services/                # Service implementations
│   │   ├── layout/              # Template initialization
│   │   ├── render/              # React → HTML rendering
│   │   ├── view/                # Liquid view generation
│   │   ├── css/                 # CSS extraction & generation
│   │   ├── html/                # Final HTML rendering
│   │   ├── asset/               # Static file copying
│   │   ├── html-converter/      # HTML → CSS conversion
│   │   └── vite-bundle/         # Vite build artifact copying
│   ├── stages/                  # Pipeline stage wrappers
│   ├── plugins/                 # Plugin system
│   ├── scripts/                 # Utility scripts
│   └── generate.ts              # High-level API
├── templates/                   # Default Liquid templates
└── test/                        # Test utilities
```

---

## Core Concepts

### 1. Services (IService)

Services are **modular, testable units of work**. Each service:
- Has a unique `name` and `version`
- Declares `dependencies` for initialization order
- Implements `initialize()`, `execute()`, `dispose()` lifecycle
- Receives `IServiceContext` with logger, eventBus, config, registry

**Service Interface:**

```typescript
interface IService<TInput, TOutput> {
  readonly name: string;
  readonly version: string;
  readonly dependencies: readonly string[];
  
  initialize(context: IServiceContext): Promise<void>;
  execute(input: TInput): Promise<TOutput>;
  dispose(): Promise<void>;
}
```

**Available Services:**

| Service | Purpose | Dependencies |
|---------|---------|--------------|
| `LayoutService` | Initialize layout templates | — |
| `RenderService` | React → HTML rendering | — |
| `ViewService` | Generate Liquid views | `layout`, `render` |
| `CssService` | CSS extraction & generation | `view`, `html-converter` |
| `HtmlService` | Render final HTML pages | `view`, `css` |
| `AssetService` | Copy static files | `html` |
| `HtmlConverterService` | HTML → CSS rules | — |
| `ViteBundleService` | Copy Vite build CSS/JS | `html` |

### 2. Pipeline Stages (IPipelineStage)

Stages **wrap services** for pipeline execution. Each stage:
- Has `name`, `order` (lower = earlier), `enabled` flag
- Can declare `dependencies` on other stages
- Implements `canExecute()` and `execute()` methods
- Has access to `IPipelineContext` with shared data storage

**Stage Interface:**

```typescript
interface IPipelineStage<TIn, TOut> {
  readonly name: string;
  readonly order: number;
  readonly enabled: boolean;
  readonly dependencies?: readonly string[];
  
  canExecute(context: IPipelineContext): boolean | Promise<boolean>;
  execute(input: TIn, context: IPipelineContext): Promise<TOut>;
}
```

**Default Pipeline Order:**

```
0: LayoutStage    → Initialize templates
1: ViewStage      → Generate Liquid views
2: CssStage       → Extract & generate CSS
3: HtmlStage      → Render HTML pages
4: AssetStage     → Copy static files
5: MdxStage       → Generate MDX documentation (optional)
```

### 3. Event Bus (IEventBus)

Enables **loose coupling** between services via publish/subscribe:

```typescript
// Subscribe
const unsubscribe = eventBus.on('css:generated', (data) => {
  console.log(`CSS generated: ${data.path}`);
});

// Emit
eventBus.emit('css:generated', { path: 'styles.css', size: 1234 });

// Unsubscribe
unsubscribe();
```

**Common Events:**

| Event | Data | When |
|-------|------|------|
| `layout:initialized` | `{ templates: string[] }` | After layout templates copied |
| `view:generated` | `{ path, html }` | After each Liquid view created |
| `css:generated` | `{ path, size }` | After CSS file written |
| `html:generated` | `{ path, route }` | After HTML page rendered |
| `vite-bundle:css-copied` | `{ source, dest, size }` | After Vite CSS copied |

### 4. Service Registry (IServiceRegistry)

Manages **dependency injection** with topological sorting:

```typescript
const registry = new ServiceRegistry();

registry.register(new CssService());      // depends on: ['view']
registry.register(new ViewService());     // depends on: ['layout']
registry.register(new LayoutService());   // depends on: []

// Topological sort for correct order
const order = registry.getInitializationOrder();
// → ['layout', 'view', 'css']

// Initialize all in correct order
await registry.initializeAll(context);

// Resolve specific service
const cssService = registry.resolve<CssService>('css');
```

---

## Working with Services

### Creating a New Service

1. **Create directory** in `src/services/`:

```
src/services/my-service/
├── MyService.ts
├── MyService.test.ts
└── index.ts
```

2. **Implement IService interface:**

```typescript
// MyService.ts
import type { IService, IServiceContext } from '../../core/interfaces';

export interface MyServiceInput {
  data: string;
}

export interface MyServiceOutput {
  result: string;
}

export interface MyServiceOptions {
  customOption?: boolean;
}

export class MyService implements IService<MyServiceInput, MyServiceOutput> {
  readonly name = 'my-service';
  readonly version = '1.0.0';
  readonly dependencies: readonly string[] = ['layout']; // Depends on layout
  
  private context!: IServiceContext;
  
  constructor(private options: MyServiceOptions = {}) {}
  
  async initialize(context: IServiceContext): Promise<void> {
    this.context = context;
    this.context.logger.info('MyService initialized');
  }
  
  async execute(input: MyServiceInput): Promise<MyServiceOutput> {
    const { logger, eventBus } = this.context;
    
    logger.info(`Processing: ${input.data}`);
    
    const result = input.data.toUpperCase();
    
    // Emit event for other services
    eventBus.emit('my-service:completed', { result });
    
    return { result };
  }
  
  async dispose(): Promise<void> {
    // Cleanup resources
  }
}
```

3. **Write tests:**

```typescript
// MyService.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MyService } from './MyService';
import type { IServiceContext } from '../../core/interfaces';

function createMockContext(): IServiceContext {
  return {
    config: {},
    logger: {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as any,
    eventBus: {
      emit: vi.fn(),
      on: vi.fn().mockReturnValue(() => {}),
    } as any,
    registry: {} as any,
  };
}

describe('MyService', () => {
  let service: MyService;
  let context: IServiceContext;
  
  beforeEach(async () => {
    context = createMockContext();
    service = new MyService();
    await service.initialize(context);
  });
  
  it('should have correct metadata', () => {
    expect(service.name).toBe('my-service');
    expect(service.version).toMatch(/^\d+\.\d+\.\d+$/);
    expect(service.dependencies).toContain('layout');
  });
  
  it('should process input correctly', async () => {
    const result = await service.execute({ data: 'hello' });
    expect(result.result).toBe('HELLO');
  });
  
  it('should emit completion event', async () => {
    await service.execute({ data: 'test' });
    expect(context.eventBus.emit).toHaveBeenCalledWith(
      'my-service:completed',
      expect.objectContaining({ result: 'TEST' })
    );
  });
});
```

4. **Export from barrel:**

```typescript
// index.ts
export { MyService } from './MyService';
export type {
  MyServiceInput,
  MyServiceOutput,
  MyServiceOptions,
} from './MyService';
```

5. **Add to services/index.ts:**

```typescript
export { MyService } from './my-service';
export type { MyServiceInput, MyServiceOutput, MyServiceOptions } from './my-service';
```

### Creating a New Stage

1. **Create stage file** in `src/stages/`:

```typescript
// MyStage.ts
import type { IPipelineStage, IPipelineContext } from '../core/interfaces';
import type { MyService, MyServiceInput } from '../services/my-service';

export interface MyStageConfig {
  enabled?: boolean;
  data: string;
}

export class MyStage implements IPipelineStage<MyStageConfig, void> {
  readonly name = 'my-stage';
  readonly order = 5; // After AssetStage (4)
  readonly enabled = true;
  readonly dependencies = ['html'] as const;
  readonly description = 'Custom processing stage';
  
  canExecute(context: IPipelineContext): boolean {
    const config = context.config as { myStage?: MyStageConfig };
    return config.myStage?.enabled !== false;
  }
  
  async execute(input: MyStageConfig, context: IPipelineContext): Promise<void> {
    const { logger, registry } = context;
    
    logger.info('📦 Running my stage...');
    
    // Get service from registry (lazy loaded)
    const myService = registry.resolve<MyService>('my-service');
    
    const result = await myService.execute({
      data: input.data,
    });
    
    // Store result for later stages
    context.setData('my-stage:result', result);
    
    logger.info(`  ✅ My stage completed: ${result.result}`);
  }
}
```

2. **Export from stages/index.ts:**

```typescript
export { MyStage } from './MyStage';
export type { MyStageConfig } from './MyStage';
```

---

## Configuration

### GenerateConfig Interface

```typescript
interface GenerateConfig {
  // Required
  app: { name: string; lang: string };
  css: {
    entryPath: string;     // React entry (e.g., './src/main.tsx')
    routes: string[];       // Routes to process
    outputDir: string;      // CSS output (e.g., './dist/css')
    pureCss?: boolean;      // Generate ui8kit.local.css
  };
  html: {
    viewsDir: string;       // Liquid templates
    routes: Record<string, RouteConfig>;
    outputDir: string;      // HTML output (e.g., './dist/html')
    mode?: 'tailwind' | 'semantic' | 'inline';
    partials?: {
      sourceDir: string;
      outputDir: string;
      props: Record<string, Record<string, string>>;
    };
  };
  
  // Optional
  mappings?: {
    ui8kitMap?: string;     // Tailwind → semantic mapping
    shadcnMap?: string;     // shadcn component styles
  };
  clientScript?: {
    enabled?: boolean;
    outputDir?: string;
    fileName?: string;
    darkModeSelector?: string;
  };
  assets?: {
    copy?: string[];        // Glob patterns
  };
  viteBundle?: {
    enabled?: boolean;
    viteBuildDir?: string;  // './dist/assets'
    cssFileName?: string;   // 'styles.css'
    copyJs?: boolean;
  };
  elements?: {
    enabled?: boolean;
    variantsDir?: string;
    outputDir?: string;
    componentsImportPath?: string;
  };
  mdx?: {
    enabled: boolean;
    docsDir: string;
    outputDir: string;
    navOutput?: string;
    basePath?: string;
    components?: Record<string, string>;
  };
}
```

---

## Testing

### Running Tests

```bash
# All tests
bun run test

# Specific service
bun vitest run src/services/my-service/MyService.test.ts

# Watch mode
bun vitest --watch

# Coverage
bun vitest --coverage
```

### Test Patterns

**Mock file system:**

```typescript
function createMockFileSystem() {
  const files = new Map<string, { content: string; size: number }>();
  
  return {
    files,
    readFile: vi.fn(async (path) => files.get(path)?.content ?? ''),
    writeFile: vi.fn(async (path, content) => {
      files.set(path, { content, size: content.length });
    }),
    mkdir: vi.fn(),
    exists: vi.fn(async (path) => files.has(path)),
    // ... other methods
  };
}
```

**Mock service context:**

```typescript
function createMockContext(): IServiceContext {
  return {
    config: {},
    logger: {
      debug: vi.fn(),
      info: vi.fn(),
      warn: vi.fn(),
      error: vi.fn(),
    } as any,
    eventBus: {
      emit: vi.fn(),
      on: vi.fn().mockReturnValue(() => {}),
    } as any,
    registry: {
      resolve: vi.fn(),
      has: vi.fn().mockReturnValue(true),
    } as any,
  };
}
```

---

## Common Tasks

### Add Support for a New File Type

1. Create service in `src/services/`
2. Create stage in `src/stages/`
3. Add config options to `GenerateConfig` in `generate.ts`
4. Wire up in `generate()` function
5. Write tests
6. Update README.md

### Modify Pipeline Order

Edit stage `order` property:
- Lower numbers execute first
- Stages with same order execute in registration order
- Use `dependencies` for hard requirements

### Add Event Emission

In service execute():

```typescript
this.context.eventBus.emit('my-event', {
  path: outputPath,
  size: content.length,
  timestamp: Date.now(),
});
```

### Debug Pipeline Execution

Enable debug logging:

```typescript
const logger = new Logger({ level: 'debug' });
const orchestrator = new Orchestrator({ logger });
```

Or in generate.ts:

```typescript
const logger = new Logger({ level: 'debug' });
```

---

## Important Patterns

### Dependency Injection

Services receive dependencies via `IServiceContext`, not constructor:

```typescript
// ✅ Correct
class MyService {
  private context!: IServiceContext;
  
  async initialize(context: IServiceContext) {
    this.context = context;
    // Access logger, eventBus, registry here
  }
}

// ❌ Avoid
class MyService {
  constructor(private logger: Logger, private eventBus: EventBus) {}
}
```

### File System Abstraction

Services should accept injectable file system for testability:

```typescript
export interface MyServiceFileSystem {
  readFile(path: string): Promise<string>;
  writeFile(path: string, content: string): Promise<void>;
  mkdir(path: string): Promise<void>;
}

export class MyService {
  private fs: MyServiceFileSystem;
  
  constructor(options: { fileSystem?: MyServiceFileSystem } = {}) {
    this.fs = options.fileSystem ?? this.createDefaultFileSystem();
  }
  
  private createDefaultFileSystem(): MyServiceFileSystem {
    return {
      readFile: async (path) => {
        const { readFile } = await import('node:fs/promises');
        return readFile(path, 'utf-8');
      },
      // ...
    };
  }
}
```

### Error Handling

Services should:
- Log errors with context
- Emit error events
- Return meaningful error messages
- Allow graceful degradation

```typescript
async execute(input: MyInput): Promise<MyOutput> {
  try {
    // ... logic
  } catch (error) {
    this.context.logger.error(`MyService failed: ${error}`);
    this.context.eventBus.emit('my-service:error', { error, input });
    throw error; // Or return default value for graceful degradation
  }
}
```

---

## Related Files

- **Interfaces**: `src/core/interfaces/*.ts`
- **README**: `README.md` (user documentation)
- **Rules**: `.cursor/rules/generator.mdc`
- **App Examples**: `apps/web/generator.config.ts`, `apps/docs/generator.config.ts`

## See Also

- Root `AGENTS.md` for project overview
- `@ui8kit/mdx-react/AGENTS.md` for MDX processing
- `@ui8kit/render` for React rendering utilities
