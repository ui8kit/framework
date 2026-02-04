# Template Plugins Guide

This guide explains how to use and extend the template plugin system for generating templates from React components.

## Built-in Plugins

The generator includes built-in plugins for popular template engines:

| Plugin | Engine | Runtime | Extension | Use Case |
|--------|--------|---------|-----------|----------|
| `liquid` | Liquid | JS | `.liquid` | Shopify, Jekyll, Eleventy |
| `handlebars` | Handlebars | JS | `.hbs` | Express.js, static sites |
| `twig` | Twig | PHP | `.twig` | Symfony, PHP applications |
| `latte` | Latte | PHP | `.latte` | Nette Framework |

## Usage

### Basic Usage

```typescript
import { TemplateService } from '@ui8kit/generator';

const service = new TemplateService();

await service.initialize({
  appRoot: process.cwd(),
  outputDir: './dist/templates',
  logger: console,
  config: {},
});

const result = await service.execute({
  sourceDirs: ['../../packages/blocks/src'],
  outputDir: './dist/templates',
  engine: 'liquid', // or 'handlebars', 'twig', 'latte'
  include: ['**/*.tsx'],
  exclude: ['**/*.test.tsx', '**/index.ts'],
  verbose: true,
});
```

### Generating for Multiple Engines

To generate templates for multiple engines, call the service multiple times:

```typescript
const engines = ['liquid', 'handlebars'];

for (const engine of engines) {
  const result = await service.execute({
    sourceDirs: ['../../packages/blocks/src'],
    outputDir: `./dist/templates/${engine}`,
    engine: engine as 'liquid' | 'handlebars',
    include: ['**/*.tsx'],
    exclude: ['**/*.test.tsx', '**/index.ts'],
  });
  
  console.log(`Generated ${result.files.length} templates for ${engine}`);
}
```

## DSL Component Mapping

The generator automatically transforms DSL components from `@ui8kit/template` to template syntax:

### If Component

**React:**
```tsx
<If test="isActive" value={isActive}>
  <span>Active</span>
</If>
```

**Liquid:**
```liquid
{% if isActive %}
  <span>Active</span>
{% endif %}
```

**Handlebars:**
```handlebars
{{#if isActive}}
  <span>Active</span>
{{/if}}
```

### Var Component

**React:**
```tsx
<Var name="title" value={title} />
```

**Liquid:**
```liquid
{{ title }}
```

**Handlebars:**
```handlebars
{{ title }}
```

### Loop Component

**React:**
```tsx
<Loop each="items" as="item" data={items}>
  <div><Var name="item.name" /></div>
</Loop>
```

**Liquid:**
```liquid
{% for item in items %}
  <div>{{ item.name }}</div>
{% endfor %}
```

**Handlebars:**
```handlebars
{{#each items}}
  <div>{{ name }}</div>
{{/each}}
```

### Slot Component

**React:**
```tsx
<Slot name="header">
  {children}
</Slot>
```

**Liquid:**
```liquid
{{ header }}
```

**Handlebars:**
```handlebars
{{ header }}
```

## Creating Custom Plugins

To create a custom template plugin:

1. Extend `BasePlugin`:

```typescript
import { BasePlugin } from '@ui8kit/generator';

export class MyCustomPlugin extends BasePlugin {
  readonly name = 'my-custom';
  readonly version = '1.0.0';
  readonly runtime = 'js';
  readonly fileExtension = '.custom';
  readonly description = 'My custom template engine';
  
  readonly features = {
    supportsFilters: true,
    supportsIncludes: true,
    supportsExtends: false,
  };
  
  // Implement transformation methods
  protected transformElement(element: GenElement): string {
    // Your transformation logic
    return '';
  }
  
  protected transformText(text: GenText): string {
    return text.value;
  }
  
  // ... other methods
}
```

2. Register the plugin:

```typescript
import { PluginRegistry } from '@ui8kit/generator';

const registry = new PluginRegistry();
registry.register({
  name: 'my-custom',
  version: '1.0.0',
  runtime: 'js',
  fileExtension: '.custom',
  description: 'My custom template engine',
}, (config) => new MyCustomPlugin());
```

## Configuration

Plugin configuration options:

```typescript
interface TemplatePluginConfig {
  /** File extension for output files */
  fileExtension?: string;
  
  /** Output directory */
  outputDir?: string;
  
  /** Pretty print output */
  prettyPrint?: boolean;
  
  /** Indentation string */
  indent?: string;
  
  /** Custom filter mappings */
  filterMappings?: Map<string, FilterDefinition>;
}
```

## Best Practices

1. **Use DSL components** - Always use `If`, `Var`, `Loop`, `Slot` from `@ui8kit/template` for dynamic content
2. **Add data-class** - Every semantic element should have a `data-class` attribute
3. **Test in dev mode** - Test blocks with actual data before generating templates
4. **Validate output** - Check generated templates match expected syntax
5. **Document variables** - Use JSDoc comments to describe expected data structure

## Troubleshooting

### Templates not generating

- Check that source directories exist and contain `.tsx` files
- Verify exclude patterns aren't too broad
- Check plugin is registered correctly

### Incorrect syntax in generated templates

- Ensure DSL components are used correctly
- Check that `data-class` attributes are present
- Verify props match expected types

### Missing variables

- Check that `Var` components have `name` prop
- Verify variable names match data structure
- Ensure `value` prop is provided for dev mode
