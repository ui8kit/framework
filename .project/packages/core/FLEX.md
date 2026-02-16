# Flex Layout — @ui8kit/core Manual

Learn how to use flexbox in UI8Kit Core. All classes come from props via `ux()` — no raw Tailwind.

---

## Components

| Component | Direction | Use case |
|-----------|-----------|----------|
| **Stack** | Vertical (`flex-col`) | Sections, forms, cards, lists |
| **Group** | Horizontal (`flex` row) | Toolbars, buttons, labels |

### Stack — vertical layout

```tsx
<Stack gap="6" items="center">
  <Title>Heading</Title>
  <Text>Paragraph</Text>
  <Button>Action</Button>
</Stack>
```

Default: `flex-col`, `gap="4"`, `items="start"`, `justify="start"`.

### Group — horizontal layout

```tsx
<Group gap="4" items="center" justify="between">
  <span>Left</span>
  <Button>Right</Button>
</Group>
```

Default: `flex` (row), `gap="4"`, `items="center"`, `justify="start"`.

---

## Props reference

### flex — direction

| Value | Output | Description |
|-------|--------|-------------|
| `""` | `flex` | display: flex, direction: row |
| `"col"` | `flex flex-col` | Vertical stack |
| `"row"` | `flex flex-row` | Horizontal row |
| `"col-reverse"` | `flex flex-col-reverse` | Vertical, reversed |
| `"row-reverse"` | `flex flex-row-reverse` | Horizontal, reversed |
| `"1"` | `flex-1` | flex-grow: 1 (fill space) |

**Note:** `flex="col"` and `flex="row"` also add `display: flex` via `ux()`.

### gap — spacing

| Value | Output | Pixels |
|-------|--------|--------|
| `"0"` | `gap-0` | 0 |
| `"1"` | `gap-1` | 0.25rem |
| `"2"` | `gap-2` | 0.5rem |
| `"4"` | `gap-4` | 1rem |
| `"6"` | `gap-6` | 1.5rem |
| `"8"` | `gap-8` | 2rem |
| `"10"` | `gap-10` | 2.5rem |
| `"12"` | `gap-12` | 3rem |

### items — align-items (cross axis)

| Value | Output |
|-------|--------|
| `"start"` | `items-start` |
| `"center"` | `items-center` |
| `"end"` | `items-end` |
| `"stretch"` | `items-stretch` |
| `"baseline"` | `items-baseline` |

### justify — justify-content (main axis)

| Value | Output |
|-------|--------|
| `"start"` | `justify-start` |
| `"center"` | `justify-center` |
| `"end"` | `justify-end` |
| `"between"` | `justify-between` |
| `"around"` | `justify-around` |
| `"evenly"` | `justify-evenly` |

---

## Examples

### Vertical centering

```tsx
<Stack flex="col" gap="6" items="center" justify="center">
  <Title>Centered</Title>
  <Button>Action</Button>
</Stack>
```

### Horizontal toolbar

```tsx
<Group gap="4" items="center" justify="between">
  <Group gap="2" items="center">
    <Icon lucideIcon={Menu} />
    <Text>Menu</Text>
  </Group>
  <Group gap="2" items="center">
    <Button size="sm">Save</Button>
    <Button size="sm">Cancel</Button>
  </Group>
</Group>
```

### Vertical Stack with horizontal buttons

```tsx
<Stack gap="6" items="center">
  <Title>Choose action</Title>
  <Group gap="4" justify="center" items="center">
    <Button>Primary</Button>
    <Button variant="outline">Secondary</Button>
  </Group>
</Stack>
```

### Override direction

```tsx
{/* Stack is vertical by default, override to horizontal */}
<Stack flex="row" gap="4" items="center">
  <Badge>1</Badge>
  <Text>Item</Text>
</Stack>

{/* Group is horizontal by default */}
<Group gap="2" items="center">
  <Icon lucideIcon={Star} />
  <Text>Rating</Text>
</Group>
```

### Full-width / flexible children

```tsx
<Stack gap="4">
  <Text>Fixed content</Text>
  <Block flex="1" data-class="filler">
    Fills remaining space
  </Block>
</Stack>

<Group gap="4">
  <Group grow>
    <Input placeholder="Takes remaining space" />
  </Group>
  <Button>Submit</Button>
</Group>
```

---

## Axes

- **Vertical (Stack)**: main axis = vertical, cross axis = horizontal  
  - `justify` → vertical alignment  
  - `items` → horizontal alignment  

- **Horizontal (Group)**: main axis = horizontal, cross axis = vertical  
  - `justify` → horizontal alignment  
  - `items` → vertical alignment  

---

## Quick reference

| Layout | Component | Props |
|--------|-----------|-------|
| Vertical stack | `Stack` | default, or `flex="col"` |
| Horizontal row | `Group` | default, or `flex="row"` |
| Centered column | `Stack` | `items="center" justify="center"` |
| Space between | `Group` | `justify="between"` |
| Centered buttons | `Group` | `justify="center" items="center"` |
| Reversed order | `Stack` / `Group` | `flex="col-reverse"` or `flex="row-reverse"` |
