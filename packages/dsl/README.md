# @ui8kit/dsl

DSL components for React to Template Engine conversion.

## Overview

This package provides declarative React components that define template logic. These components are detected by the `@ui8kit/generator` and converted to template engine syntax (Liquid, Handlebars, Twig, Latte).

## Installation

```bash
bun add @ui8kit/dsl
```

## Usage

```tsx
import { Loop, If, Else, Var, Slot, Include } from '@ui8kit/dsl';

function ProductCard({ product, isOnSale }) {
  return (
    <article className="product-card">
      <h2><Var>product.name</Var></h2>
      <p className="price">
        <Var name="product.price" filter="currency" />
      </p>
      
      <If test="isOnSale">
        <span className="badge">SALE</span>
      </If>
      
      <Slot name="actions" />
    </article>
  );
}

function ProductList({ items, isLoading }) {
  return (
    <div className="product-list">
      <If test="isLoading">
        <div className="spinner">Loading...</div>
      </If>
      <Else>
        <Loop each="items" as="item" keyExpr="item.id">
          <Include partial="product-card" props={{ product: "item" }} />
        </Loop>
      </Else>
    </div>
  );
}
```

## Components

### `<Loop>`

Iterates over a collection.

```tsx
<Loop each="items" as="item" keyExpr="item.id" index="i">
  <li><Var>item.name</Var></li>
</Loop>
```

**Props:**
- `each` - Collection variable name
- `as` - Iterator variable name
- `keyExpr` - Key expression (optional)
- `index` - Index variable name (optional)

### `<If>` / `<Else>` / `<ElseIf>`

Conditional rendering.

```tsx
<If test="isActive">
  <span>Active</span>
</If>
<ElseIf test="isPending">
  <span>Pending</span>
</ElseIf>
<Else>
  <span>Inactive</span>
</Else>
```

### `<Var>`

Variable output with optional filters.

```tsx
<Var>user.name</Var>
<Var name="price" filter="currency" default="0.00" />
```

**Props:**
- `name` or `children` - Variable path
- `filter` - Filter to apply
- `default` - Default value
- `raw` - Output without escaping

### `<Slot>`

Content slot for children/blocks.

```tsx
<Slot name="header" />
<Slot>{children}</Slot>
```

### `<Include>`

Include a partial.

```tsx
<Include partial="header" />
<Include partial="card" props={{ title: "item.title" }} />
```

### `<DefineBlock>` / `<Extends>`

Template inheritance (Twig/Latte). Note: `DefineBlock` is named to avoid conflict with `@ui8kit/core` Block component.

```tsx
<Extends layout="base" />
<DefineBlock name="title">Page Title</DefineBlock>
```

### `<Raw>`

Unescaped HTML output.

```tsx
<Raw>htmlContent</Raw>
```

## Generated Output

### Liquid

```liquid
{% for item in items %}
  <li>{{ item.name }}</li>
{% endfor %}

{% if isActive %}
  <span>Active</span>
{% endif %}
```

### Handlebars

```handlebars
{{#each items as |item|}}
  <li>{{item.name}}</li>
{{/each}}

{{#if isActive}}
  <span>Active</span>
{{/if}}
```

### Twig

```twig
{% for item in items %}
  <li>{{ item.name }}</li>
{% endfor %}

{% if isActive %}
  <span>Active</span>
{% endif %}
```

### Latte

```latte
{foreach $items as $item}
  <li>{$item.name}</li>
{/foreach}

{if $isActive}
  <span>Active</span>
{/if}
```

## How It Works

1. DSL components render with `data-gen-*` attributes
2. Generator parses React components using Babel
3. Generator detects DSL markers in the AST
4. Template plugins convert markers to engine-specific syntax

## License

MIT
