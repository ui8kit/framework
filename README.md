# UI8Kit Framework

**The Next Generation UI System for React & HTML5/CSS3**

UI8Kit is a comprehensive UI framework that bridges the gap between React development and semantic HTML5/CSS3. Build modern web applications with type-safe React components, then generate production-ready static sites with semantic CSS classes.

## ✨ Features

- **🔧 React Components** — Type-safe UI components with strict prop validation
- **🎨 HTML5/CSS3 Semantics** — Bootstrap/Uikit3-style semantic classes (`button button-primary`)
- **📱 Responsive Design** — Mobile-first approach with breakpoint-specific utilities
- **⚡ Performance** — Zero-runtime CSS-in-JS, static generation ready
- **🎯 Developer Experience** — Full TypeScript support, hot reloading, comprehensive docs
- **🏗️ Architecture** — Monorepo with Turbo orchestration, multiple deployment targets

## 🚀 Quick Start

```bash
# Install dependencies
bun install

# Start local development
bun run dev

# Generate static HTML for production
bun run html
```

## 📁 Project Structure

```
ui8kit-framework/
├── apps/
│   ├── local/          # Development environment (Vite + React)
│   └── generator/       # Static site generator (Liquid templates → HTML5/CSS3)
├── packages/           # Shared packages
└── turbo.json          # Monorepo orchestration
```

## 🎯 Use Cases

- **Component Libraries** — Build and document reusable UI components
- **Static Sites** — Generate SEO-friendly HTML from React routes
- **Prototyping** — Rapid UI development with semantic constraints
- **Documentation** — Self-documenting component systems

## 💡 Philosophy

UI8Kit embraces the best of both worlds: the developer experience of React with the simplicity and performance of semantic HTML5/CSS3. Every component is designed to output clean, accessible markup that works without JavaScript.

## 📖 About UI8Kit Framework

UI8Kit is more than just a component library—it's a complete UI development paradigm that bridges modern React development with traditional semantic HTML5/CSS3 approaches.

See [DESCRIPTION.md](DESCRIPTION.md) for detailed technical overview.

### The Problem
Traditional React component libraries often generate complex DOM structures with CSS-in-JS, resulting in:
- Heavy JavaScript bundles
- Runtime performance overhead
- Inconsistent styling approaches
- Difficult static site generation

### The Solution
UI8Kit provides a dual approach:
1. **Development Phase**: Use type-safe React components with strict prop validation
2. **Production Phase**: Generate semantic HTML5/CSS3 that works without JavaScript

### Key Innovations
- **Utility Props Map**: Strict validation ensuring only semantic, accessible properties
- **Component Variants**: Predefined variants for consistent design systems
- **Static Generation**: Convert React routes to pure HTML5/CSS3
- **Semantic Classes**: Bootstrap/Uikit3-style class naming (`.button.button-primary`)
- **Type Safety**: Full TypeScript support with compile-time validation

### Architecture Benefits
- **Performance**: Zero-runtime styling, minimal JavaScript footprint
- **Accessibility**: Semantic HTML5 with proper ARIA attributes
- **SEO**: Server-side generated static content
- **Developer Experience**: Hot reloading, TypeScript, comprehensive documentation
- **Flexibility**: Works for both SPAs and static sites

## 📄 License

GPL-3.0 License - see [LICENSE](LICENSE) file for details.