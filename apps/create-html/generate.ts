// bun apps/create-html/generate

import { RouteToStatic } from './scripts/routeToStatic'
import { HtmlToCss } from './scripts/htmlToCss'

// 1. Generate HTML files
console.log('🏗️  Generating HTML files...')
const htmlGenerator = new RouteToStatic()
htmlGenerator.configure({
  entryPath: '../../apps/local/src/main.tsx',
  outputDir: './www/html',
  cssSources: ['../../apps/local/src/assets/css/style.css'],
  title: 'My HTML App',
  // dataModulePath: '../../apps/local/src/data/index.ts'
})
await htmlGenerator.generateAll()

// 2. Generate CSS from HTML files
console.log('🎨 Generating CSS files...')
const cssGenerator = new HtmlToCss()
cssGenerator.configure({
  htmlDir: './www/html',
  ui8kitMapPath: './lib/ui8kit.map.json',
  applyCssFile: './www/html/assets/css/tailwind.apply.css',
  pureCssFile: './www/html/assets/css/ui8kit.local.css',
  stylesMode: 'css3inline', // Options: 'tailwind' | 'css3' | 'css3inline'
  outputHtmlDir: './www/html' // Output directory for modified HTML
})
await cssGenerator.generateAll()

console.log('✅ Static site generation completed!')