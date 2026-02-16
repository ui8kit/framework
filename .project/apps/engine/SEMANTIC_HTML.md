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

## Nesting minimization

Reduce div-in-div nesting until `<section>`:

- **Root as layout**: `#root` is the layout container; no extra wrapper div
- MainLayout: Fragment; header, main, footer are direct children of root (flex-col)
- DashLayout: Fragment; aside, main are direct children of root (flex-row via `:has(> aside)`)
- Merge Container + Group/Stack when same layout layer
- Use `Group component="span"` inside links (span instead of div)
- Layout full mode: `main` > `Container` (flex col) > blocks (no extra Stack)
- Header: `header` > `Container` (flex) > brand + nav

## Applied

- Header: `header` + `nav` inside; merged container; `Group component="span"` for brand
- MainLayout: `header` → `main` → `footer`; full mode: main > Container > children
- DashLayout: `aside` + `main` (siblings)
- Blocks: `section` for sections, `article` for cards; HeroBlock: section > Container > content
