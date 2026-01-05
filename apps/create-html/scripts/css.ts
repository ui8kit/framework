// CSS generation script
import { HtmlToCss } from './htmlToCss.js'

const cssGenerator = new HtmlToCss()
cssGenerator.configure({
  htmlDir: './www/html',
  ui8kitMapPath: './lib/ui8kit.map.ts',
  applyCssFile: './www/html/assets/css/tailwind.apply.css',
  pureCssFile: './www/html/assets/css/ui8kit.local.css'
})
await cssGenerator.generateAll()
