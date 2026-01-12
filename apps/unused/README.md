# Unused CSS Online! (Browser Version)


```bash
bun install

bun run dev

bun run build

bun run preview
```

```javascript
const doc = new DOMParser().parseFromString(html, 'text/html')

const selectors = extractSelectorsFromCSS(css)

selectors.forEach(selector => {
  if (doc.querySelector(selector)) {
    usedSelectors.add(selector)
  }
})

const cleanCSS = generateCleanCSS(css, usedSelectors)
```