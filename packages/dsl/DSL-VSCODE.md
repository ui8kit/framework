# DSL Component Highlighting in VS Code

This guide explains how to configure VS Code to visually distinguish `@ui8kit/dsl` DSL components from regular JSX/HTML tags using the [vscode-highlight](https://marketplace.visualstudio.com/items?itemName=fabiospampinato.vscode-highlight) extension.

## Why Highlight DSL Components?

The `@ui8kit/dsl` package provides declarative components (`Loop`, `If`, `Var`, `Slot`, etc.) that define template logic for conversion to various template engines. Visually distinguishing these DSL components from regular React/HTML tags makes it easier to:

- Quickly identify template logic within your components
- Differentiate between UI components and template directives
- Improve code readability in mixed React/template codebases

## Prerequisites

Install the **vscode-highlight** extension:

```bash
ext install fabiospampinato.vscode-highlight
```

Or install from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=fabiospampinato.vscode-highlight).

## Configuration

Add the following configuration to your workspace settings (`.vscode/settings.json`):

```json
{
  "highlight.regexes": {
    "(//TODO)": [
      {
        "backgroundColor": "theme.notifications.foreground",
        "color": "theme.notifications.foreground"
      }
    ],
    "(<)(Loop|If|Else|ElseIf|Var|Slot|Include|DefineBlock|Extends|Raw)(?:\\s[^>/]*)?(\\s*)(\\/?>)": {
      "filterFileRegex": ".*\\.(tsx|jsx)$",
      "decorations": [
        {
          "color": "theme.notifications.foreground",
          "fontStyle": "italic"
        },
        {
          "color": "theme.notifications.foreground",
          "fontStyle": "italic"
        },
        {},
        {
          "color": "theme.notifications.foreground",
          "fontStyle": "italic"
        }
      ]
    },
    "(<\\/)(Loop|If|Else|ElseIf|Var|Slot|Include|DefineBlock|Extends|Raw)(>)": {
      "filterFileRegex": ".*\\.(tsx|jsx)$",
      "decorations": [
        {
          "color": "theme.notifications.foreground",
          "fontStyle": "italic"
        },
        {
          "color": "theme.notifications.foreground",
          "fontStyle": "italic"
        },
        {
          "color": "theme.notifications.foreground",
          "fontStyle": "italic"
        }
      ]
    }
  }
}
```

## How It Works

### Opening Tags Regex

```regex
(<)(Loop|If|Else|ElseIf|Var|Slot|Include|DefineBlock|Extends|Raw)(?:\s[^>/]*)?(\\s*)(\\/?>)
```

This regex matches opening tags like `<Loop>`, `<Var name="title" />`, or `<If test="condition">` and breaks them into four capturing groups:

1. **Group 1: `(<)`** - The opening angle bracket `<`
   - **Decoration**: Highlighted with theme color and italic style
   
2. **Group 2: `(Loop|If|Else|...)`** - The DSL component name
   - **Decoration**: Highlighted with theme color and italic style
   
3. **Group 3: `(\\s*)`** - Optional whitespace before the closing bracket
   - **Decoration**: None (empty object `{}`) - this keeps attributes unhighlighted
   
4. **Group 4: `(\\/?>)`** - The closing bracket `>` or self-closing `/>`
   - **Decoration**: Highlighted with theme color and italic style

**Pattern Breakdown:**

- `(<)` - Captures the opening bracket
- `(Loop|If|...)` - Captures any of the DSL component names
- `(?:\\s[^>/]*)?` - Non-capturing group for attributes (matches spaces and any characters except `>` and `/`)
- `(\\s*)` - Captures optional whitespace before the closing bracket
- `(\\/?>)` - Captures either `>` or `/>`

**Note:** The regex excludes `/` from the attributes pattern (`[^>/]`) to ensure the forward slash in self-closing tags is captured by Group 4, not lost in the attributes.

### Closing Tags Regex

```regex
(<\\/)(Loop|If|Else|ElseIf|Var|Slot|Include|DefineBlock|Extends|Raw)(>)
```

This regex matches closing tags like `</Loop>`, `</If>`, or `</DefineBlock>` and breaks them into three capturing groups:

1. **Group 1: `(<\\/)`** - The opening bracket and forward slash `</`
   - **Decoration**: Highlighted with theme color and italic style
   
2. **Group 2: `(Loop|If|...)`** - The DSL component name
   - **Decoration**: Highlighted with theme color and italic style
   
3. **Group 3: `(>)`** - The closing bracket `>`
   - **Decoration**: Highlighted with theme color and italic style

**Pattern Breakdown:**

- `(<\\/)` - Captures `</` (note: `\\/` is double-escaped for JSON)
- `(Loop|If|...)` - Captures any of the DSL component names
- `(>)` - Captures the closing bracket

### File Filtering

```json
"filterFileRegex": ".*\\.(tsx|jsx)$"
```

Both regexes include a file filter that applies highlighting only to `.tsx` and `.jsx` files, preventing unnecessary processing in other file types.

## Theme Colors

The configuration uses **theme color identifiers** prefixed with `theme.` to automatically adapt to your active VS Code theme:

```json
{
  "color": "theme.notifications.foreground",
  "fontStyle": "italic"
}
```

### Available Theme Colors

You can use any [VS Code theme color identifier](https://code.visualstudio.com/api/references/theme-color). Common options for text highlighting:

- `theme.notifications.foreground` - Notification text color
- `theme.badge.foreground` - Badge text color (often high contrast)
- `theme.badge.background` - Badge background color
- `theme.textLink.foreground` - Link text color (usually blue)
- `theme.errorForeground` - Error text color (usually red)
- `theme.warningForeground` - Warning text color (usually yellow/orange)

### Custom Colors

You can also use hardcoded hex colors instead of theme colors:

```json
{
  "color": "#22D3EE",
  "fontWeight": "bold"
}
```

However, theme colors are recommended because they:
- Automatically adapt to dark/light themes
- Maintain consistency with your editor's color scheme
- Update when you switch themes

## Examples

### Example 1: Basic Usage

```tsx
import { Loop, If, Var } from '@ui8kit/dsl';

function ProductList({ items }) {
  return (
    <Loop each="items" as="item">
      <If test="item.inStock">
        <Var>item.name</Var>
      </If>
    </Loop>
  );
}
```

**Result:** The tags `<Loop>`, `</Loop>`, `<If>`, `</If>`, `<Var>`, and `</Var>` are highlighted, but `item` attributes and tag contents remain unhighlighted.

### Example 2: Self-Closing Tags

```tsx
<Extends layout="base" />
<Slot name="content" />
```

**Result:** Both `<Extends` and `/>`, and `<Slot` and `/>` are highlighted, but the attributes `layout="base"` and `name="content"` remain unhighlighted.

### Example 3: Mixed Components

```tsx
<Block component="div">
  <DefineBlock name="title">
    <Var name="pageTitle" default="Home" />
  </DefineBlock>
</Block>
```

**Result:** Only the DSL tags (`<DefineBlock>`, `<Var />`) are highlighted. The regular React component `<Block>` uses default JSX highlighting.

## Customization

### Changing Colors

To use a different color scheme:

```json
{
  "color": "#A78BFA",
  "fontWeight": "bold",
  "backgroundColor": "rgba(167, 139, 250, 0.1)"
}
```

### Per-Component Colors

To highlight different DSL components with different colors, create separate regex entries:

```json
{
  "highlight.regexes": {
    "(<)(Loop)(?:\\s[^>/]*)?(\\s*)(\\/?>)": {
      "filterFileRegex": ".*\\.(tsx|jsx)$",
      "decorations": [
        { "color": "#60A5FA", "fontWeight": "bold" },
        { "color": "#60A5FA", "fontWeight": "bold" },
        {},
        { "color": "#60A5FA", "fontWeight": "bold" }
      ]
    },
    "(<)(Var)(?:\\s[^>/]*)?(\\s*)(\\/?>)": {
      "filterFileRegex": ".*\\.(tsx|jsx)$",
      "decorations": [
        { "color": "#34D399", "fontWeight": "bold" },
        { "color": "#34D399", "fontWeight": "bold" },
        {},
        { "color": "#34D399", "fontWeight": "bold" }
      ]
    }
  }
}
```

## Troubleshooting

### Highlighting Not Working

1. **Verify the extension is installed:**
   ```bash
   ext install fabiospampinato.vscode-highlight
   ```

2. **Check for typos:** The setting key must be exactly `highlight.regexes` (not `highlight.regees` or similar)

3. **Reload VS Code:** Press `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac) and run "Developer: Reload Window"

4. **Verify file type:** Highlighting only works in `.tsx` and `.jsx` files due to the `filterFileRegex` setting

### Regex Not Matching

If tags aren't being highlighted:

- Ensure the component name is in the list: `Loop|If|Else|ElseIf|Var|Slot|Include|DefineBlock|Extends|Raw`
- Check for proper double-escaping in JSON (e.g., `\\s` for `\s`, `\\/` for `\/`)
- Test the regex using a tool like [regex101.com](https://regex101.com/) (remember to remove one level of escaping for testing)

### Performance Issues

The vscode-highlight extension is optimized for "intraline" regexes (patterns that don't match newlines). Our regexes are intraline-safe, so performance should be excellent even in large files.

## DSL Components Reference

The following components are highlighted by this configuration:

| Component | Purpose | Example |
|-----------|---------|---------|
| `Loop` | Iteration | `<Loop each="items" as="item">` |
| `If` | Conditional | `<If test="isActive">` |
| `Else` | Else branch | `<Else>` |
| `ElseIf` | Else-if | `<ElseIf test="isPending">` |
| `Var` | Variable output | `<Var>user.name</Var>` |
| `Slot` | Content slot | `<Slot name="header" />` |
| `Include` | Partial include | `<Include partial="card" />` |
| `DefineBlock` | Template block | `<DefineBlock name="content">` |
| `Extends` | Template inheritance | `<Extends layout="base" />` |
| `Raw` | Unescaped output | `<Raw>htmlContent</Raw>` |

## Further Reading

- [vscode-highlight Documentation](https://marketplace.visualstudio.com/items?itemName=fabiospampinato.vscode-highlight)
- [VS Code Theme Color Reference](https://code.visualstudio.com/api/references/theme-color)
- [VS Code Decoration API](https://code.visualstudio.com/api/references/vscode-api#DecorationRenderOptions)
- [@ui8kit/dsl Package](../README.md)

## License

This configuration is part of the @ui8kit/dsl package and is licensed under MIT.
