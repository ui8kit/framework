// Simple test of all three modes
import { HtmlToCss } from './scripts/htmlToCss'

async function testModes() {
  console.log('🧪 Testing all styles modes on test-base.html...\n')

  // Copy base file to different directories for testing
  const fs = await import('fs')
  const path = await import('path')

  // Create directories
  const dirs = ['./www/tailwind', './www/css3', './www/css3inline']
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    // Copy test file
    fs.copyFileSync('./test-base.html', path.join(dir, 'index.html'))
  }

  console.log('📁 Created test directories\n')

  // Test Tailwind mode
  console.log('🎨 Testing TAILWIND mode...')
  const tailwindCss = new HtmlToCss()
  tailwindCss.configure({
    htmlDir: './www/tailwind',
    ui8kitMapPath: './lib/ui8kit.map.json',
    applyCssFile: './www/tailwind/tailwind.apply.css',
    pureCssFile: './www/tailwind/ui8kit.local.css',
    stylesMode: 'tailwind'
  })
  await tailwindCss.generateAll()
  console.log('✅ Tailwind mode completed\n')

  // Test CSS3 mode
  console.log('🎨 Testing CSS3 mode...')
  const css3Css = new HtmlToCss()
  css3Css.configure({
    htmlDir: './www/css3',
    ui8kitMapPath: './lib/ui8kit.map.json',
    applyCssFile: './www/css3/tailwind.apply.css',
    pureCssFile: './www/css3/ui8kit.local.css',
    stylesMode: 'css3'
  })
  await css3Css.generateAll()
  console.log('✅ CSS3 mode completed\n')

  // Test CSS3 Inline mode
  console.log('🎨 Testing CSS3 INLINE mode...')
  const css3inlineCss = new HtmlToCss()
  css3inlineCss.configure({
    htmlDir: './www/css3inline',
    ui8kitMapPath: './lib/ui8kit.map.json',
    applyCssFile: './www/css3inline/tailwind.apply.css',
    pureCssFile: './www/css3inline/ui8kit.local.css',
    stylesMode: 'css3inline'
  })
  await css3inlineCss.generateAll()
  console.log('✅ CSS3 Inline mode completed\n')

  console.log('🎉 All modes tested successfully!')
  console.log('\n📂 Check results in ./www/ directories')
}

// Run the test
testModes().catch(console.error)
