# Route Components

Page-level components that compose multiple semantic blocks.

## Purpose

Routes are the top-level page components that orchestrate multiple blocks to create complete page layouts. They handle the overall page structure and composition.

## Structure

```tsx
// Route composes multiple blocks
export function HomePage() {
  return (
    <>
      <HeroBlock />
      <FeaturesBlock />
      <FooterBlock />
    </>
  );
}
```

## Rules

- **Composition only** - routes don't contain styling or complex logic
- **Multiple blocks** - each route combines several semantic blocks
- **Layout delegation** - layout concerns are handled by Layout components
- **Pure structure** - focuses on content organization

## Available Routes

- `Blank.tsx` - Dashboard page with single block
- `HomePage.tsx` - Landing page with hero + features

## Usage

Routes are used by React Router for page navigation:

```tsx
// In router configuration
{
  path: "/",
  element: <HomePage />
},
{
  path: "/dashboard",
  element: <Blank />
}
```

## File Structure

```
routes/
├── HomePage.tsx    # Landing page composition
├── AboutPage.tsx   # About page (future)
├── BlogPage.tsx    # Blog listing (future)
└── Blank.tsx       # Dashboard page
```</contents>
</xai:function_call">Created new file apps/local/src/routes/README.md
