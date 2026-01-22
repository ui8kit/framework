# @ui8kit/vite-local

**Local Development Environment for UI8Kit Framework**

This application provides a Vite-based development server for building, testing, and documenting UI8Kit components and layouts.

## Purpose

- **Component Development**: Build and test UI8Kit React components
- **Layout Prototyping**: Create and validate page layouts
- **Documentation**: Interactive component documentation
- **Hot Reloading**: Fast development with live updates

## Architecture

- **Framework**: Vite + React + TypeScript
- **UI System**: UI8Kit components with strict prop validation
- **Styling**: Tailwind CSS with semantic utilities
- **State**: React hooks with theme support

## Development

```bash
# Install dependencies
bun install

# Start development server
bun run dev

# Build for production (local testing)
bun run build
bun run preview
```

## Important Notes

⚠️ **This application is NOT for web production deployment**

- Use only for local development and component testing
- For production websites, use `@ui8kit/generator` to generate static HTML from Liquid templates
- All components follow UI8Kit prop validation rules

## File Structure

```
src/
├── components/     # UI8Kit components
├── layouts/        # Page layouts
├── routes/         # Application routes
├── providers/      # React context providers
├── exceptions/     # Error boundaries
├── lib/           # Utilities and prop mappings
├── variants/      # Component variants
└── assets/        # Static assets (CSS, images)
```</contents>
</xai:function_call">Created new file apps/local/README.md
