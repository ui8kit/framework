// Test all three styles modes
import { RouteToStatic } from './scripts/routeToStatic'
import { HtmlToCss } from './scripts/htmlToCss'

async function testAllModes() {
  console.log('🚀 Testing all styles modes...\n')

  // 1. Generate base HTML
  console.log('📄 Generating base HTML...')
  const htmlGenerator = new RouteToStatic()
  htmlGenerator.configure({
    entryPath: '../../apps/local/src/main.tsx',
    outputDir: './www/html',
    cssSources: ['../../apps/local/src/assets/css/style.css'],
    title: 'UI8Kit Test',
  })
  await htmlGenerator.generateAll()
  console.log('✅ Base HTML generated\n')

  // 2. Test Tailwind mode
  console.log('🎨 Testing TAILWIND mode...')
  const tailwindCss = new HtmlToCss()
  tailwindCss.configure({
    htmlDir: './www/html',
    ui8kitMapPath: './lib/ui8kit.map.json',
    applyCssFile: './www/tailwind/assets/css/tailwind.apply.css',
    pureCssFile: './www/tailwind/assets/css/ui8kit.local.css',
    stylesMode: 'tailwind',
    outputHtmlDir: './www/tailwind'
  })
  await tailwindCss.generateAll()
  console.log('✅ Tailwind mode completed\n')

  // 3. Test CSS3 mode
  console.log('🎨 Testing CSS3 mode...')
  const css3Css = new HtmlToCss()
  css3Css.configure({
    htmlDir: './www/html',
    ui8kitMapPath: './lib/ui8kit.map.json',
    applyCssFile: './www/css3/assets/css/tailwind.apply.css',
    pureCssFile: './www/css3/assets/css/ui8kit.local.css',
    stylesMode: 'css3',
    outputHtmlDir: './www/css3'
  })
  await css3Css.generateAll()
  console.log('✅ CSS3 mode completed\n')

  // 4. Test CSS3 Inline mode
  console.log('🎨 Testing CSS3 INLINE mode...')
  const css3inlineCss = new HtmlToCss()
  css3inlineCss.configure({
    htmlDir: './www/html',
    ui8kitMapPath: './lib/ui8kit.map.json',
    applyCssFile: './www/css3inline/assets/css/tailwind.apply.css',
    pureCssFile: './www/css3inline/assets/css/ui8kit.local.css',
    stylesMode: 'css3inline',
    outputHtmlDir: './www/css3inline'
  })
  await css3inlineCss.generateAll()
  console.log('✅ CSS3 Inline mode completed\n')

  console.log('🎉 All modes tested successfully!')
  console.log('\n📂 Output directories:')
  console.log('   ./www/tailwind/     - Classes in HTML')
  console.log('   ./www/css3/         - Pure CSS3 + tailwind.apply.css')
  console.log('   ./www/css3inline/   - Inline styles in <head>')
}

// Run the test
testAllModes().catch(console.error)
