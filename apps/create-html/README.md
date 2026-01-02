# @ui8kit/create-html

**Static Site Generator for UI8Kit Framework**

This application converts React routes and components into production-ready HTML5/CSS3 static sites with semantic markup.

## Purpose

- **Static Generation**: Convert React applications to HTML files
- **SEO Optimization**: Generate search-friendly static content
- **Performance**: Zero-runtime styling and JavaScript overhead
- **Semantic HTML**: Output clean, accessible HTML5 with semantic classes

## Features

- **Route-to-HTML Conversion**: Transform React Router routes to static files
- **Semantic CSS Classes**: Generate Bootstrap/Uikit3-style class names
- **SEO Metadata**: Automatic meta tag generation from content
- **Dark Mode Support**: Static dark/light theme handling
- **Accessibility**: Proper ARIA attributes and semantic markup

## Architecture

- **Input**: React components from `@ui8kit/vite-local`
- **Processing**: RouteToStatic utility with parse5 and React DOM server
- **Output**: Clean HTML5 files with semantic CSS classes
- **Styling**: Pure CSS without JavaScript runtime

## Usage

```bash
# Generate static HTML from React routes
bun run html

# The output will be in apps/html/ directory
# Ready for deployment to any static hosting service
```

## Generated Output

Each React route becomes:
- `index.html` - Main page
- `about/index.html` - About page
- `blog/post-1/index.html` - Dynamic routes

## Example Output Structure

```html
<!-- Generated HTML -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UI8Kit App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-background text-foreground">
  <button class="button button-primary">Click me</button>
</body>
</html>
```

## Integration

Works seamlessly with:
- `@ui8kit/vite-local` - Development environment
- UI8Kit component library - Source of components
- Any static hosting service (Netlify, Vercel, GitHub Pages, etc.)

## File Structure

```
scripts/
├── routeToStatic.ts    # Main generation script
└── generate.ts         # Build orchestration
```</contents>
</xai:function_call">Created new file apps/create-html/README.md