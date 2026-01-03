// bun apps/create-html/generate

import { RouteToStatic } from './scripts/routeToStatic'

const generator = new RouteToStatic()
generator.configure({
  entryPath: 'apps/local/src/main.tsx',
  outputDir: './www/html',
  cssSources: ['apps/local/src/assets/css/style.css'],
  title: 'My HTML App',
  // dataModulePath: 'apps/local/src/data/index.ts'
})
await generator.generateAll()