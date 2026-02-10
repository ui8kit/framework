# Semantic HTML5 — Engine Guidelines

Target: **valid W3C HTML5 + CSS3** after generation.

## Component Mapping

| HTML5 Element | Usage | UI8Kit |
|---------------|-------|--------|
| `<header>` | Site header (brand + nav) | `<Block component="header">` |
| `<nav>` | Navigation links only | `<Block component="nav">` |
| `<main>` | Primary content only | `<Block component="main">` |
| `<aside>` | Sidebar, complementary | `<Block component="aside">` |
| `<footer>` | Site footer | `<Block component="footer">` |
| `<section>` | Thematic grouping | `<Block component="section">` |
| `<article>` | Self-contained (card, quote) | `<Stack component="article">` |
| `<h1>`–`<h6>` | Headings | `<Title order={1-6}>` |
| `<p>` | Paragraphs | `<Text>` |

## Layout Rules

1. **Header**: `<header>` wraps brand + `<nav>`. Do not use `nav` for the whole bar.
2. **Main**: `<main>` must not wrap `<aside>`. Use a wrapper `div` for layout.
3. **One main per page**: Single `<main>` landmark.
4. **Heading hierarchy**: Use `order={1}` for h1, `order={2}` for h2, etc.

## Applied

- Header: `header` + `nav` inside
- MainLayout: `header` → `main` → `footer`
- DashLayout: `aside` + `main` (siblings)
- Blocks: `section` for sections, `article` for cards (feature, pricing, testimonial)
