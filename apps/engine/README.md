# Templetor

Test application demonstrating the **DSL-based React to Template Engine conversion**.

## Overview

Templetor showcases the `@ui8kit/template` DSL package, which provides declarative React components for defining template logic that can be converted to multiple template engine formats:

- **Liquid** (Shopify, Jekyll, Eleventy)
- **Handlebars** (JavaScript)
- **Twig** (PHP, Symfony)
- **Latte** (PHP, Nette)

## Internal Navigation Checklist (Domain Builds)

Use this checklist when changing routes, tabs, header links, or sidebars:

1. Update the page model in `packages/data/src/fixtures/shared/page.json`.
2. Keep links data-driven (`context.navItems`, domain sidebars), avoid hardcoded internal paths when possible.
3. In UI components, use `DomainNavButton` for internal navigation.
4. If a component cannot use `DomainNavButton`, use:
   - `context.resolveNavigation(href)`
   - `context.navigation.isEnabled(href)`
   and keep soft policy behavior (`disabled` + tooltip `Not available in this domain build`).
5. Re-run pipeline sync for the target domain/app and validate:
   - `bun run scripts/pipeline-app.ts sync --target <app> --domain <domain> --data-mode <local|shared>`
   - `bun run validate:data-bundle -- --target <app>`

## DSL Components

```tsx
import { Loop, If, Else, Var, Slot, Include, DefineBlock, Extends } from '@ui8kit/template';
```

| Component | Description | Example Output (Liquid) |
|-----------|-------------|-------------------------|
| `<Loop each="items" as="item">` | Iteration | `{% for item in items %}` |
| `<If test="isActive">` | Conditional | `{% if isActive %}` |
| `<Else>` | Else branch | `{% else %}` |
| `<ElseIf test="isPending">` | Else-if | `{% elsif isPending %}` |
| `<Var>user.name</Var>` | Variable output | `{{ user.name }}` |
| `<Var name="title" default="Untitled">` | With default | `{{ title \| default: "Untitled" }}` |
| `<Slot name="content">` | Content slot | `{{ content }}` |
| `<Include partial="card">` | Partial include | `{% include 'card.liquid' %}` |
| `<DefineBlock name="title">` | Template block | `{% capture title %}` |
| `<Extends layout="base">` | Inheritance | Not supported in Liquid |

## Usage

### Generate Liquid templates (default)

```bash
bun run generate
```

### Generate for other engines

```bash
bun run generate --engine handlebars
bun run generate --engine twig
bun run generate --engine latte
```

## Example Component

```tsx
// src/components/ProductList.tsx
import { Loop, If, Else, Var, Include } from '@ui8kit/template';

export function ProductList({ products, isLoading, title }) {
  return (
    <section className="product-list">
      <h1><Var name="title" default="Products" /></h1>
      
      <If test="isLoading">
        <div className="spinner">Loading...</div>
      </If>
      <Else>
        <div className="grid">
          <Loop each="products" as="product" keyExpr="product.id">
            <Include partial="product-card" props={{ product: "product" }} />
          </Loop>
        </div>
      </Else>
    </section>
  );
}
```

### Generated Liquid

```liquid
<section class="product-list">
  <h1>{{ title | default: "Products" }}</h1>
  
  {% if isLoading %}
    <div class="spinner">Loading...</div>
  {% endif %}
  {% else %}
    <div class="grid">
      {% for product in products %}
        {% include 'product-card.liquid' %}
      {% endfor %}
    </div>
</section>
```

### Generated Twig

```twig
<section class="product-list">
  <h1>{{ title ?? "Products" }}</h1>
  
  {% if isLoading %}
    <div class="spinner">Loading...</div>
  {% endif %}
  {% else %}
    <div class="grid">
      {% for product in products %}
        {% include 'product-card.twig' %}
      {% endfor %}
    </div>
</section>
```

### Generated Latte

```latte
<section class="product-list">
  <h1>{$title ?? "Products"}</h1>
  
  {if $isLoading}
    <div class="spinner">Loading...</div>
  {/if}
  {else}
    <div class="grid">
      {foreach $products as $product}
        {include 'product-card.latte'}
      {/foreach}
    </div>
</section>
```

## Output Structure

```
dist/templates/
├── Layout.liquid
├── ProductCard.liquid
├── ProductList.liquid
└── UserProfile.liquid
```

## Architecture

1. **DSL Components** (`@ui8kit/template`) - React components with `data-gen-*` markers
2. **JSX Transformer** - Parses React to HAST with annotations
3. **Template Plugins** - Convert HAST to specific template syntax

```
React + DSL → JSX Parser → HAST + Annotations → Plugin → Template
```
