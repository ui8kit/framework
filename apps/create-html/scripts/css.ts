// CSS generation script
import { HtmlToCss } from './htmlToCss.js'

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
