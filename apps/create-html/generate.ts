// bun apps/create-html/generate

import { RouteToStatic } from './scripts/routeToStatic'

const generator = new RouteToStatic()
generator.configure({
  entryPath: 'apps/admin/src/main.tsx',
  outputDir: './www/html',
  cssSources: ['apps/admin/src/assets/css/style.css'],
  title: 'My HTML App',
  // dataModulePath: 'apps/admin/src/data/index.ts'
})
await generator.generateAll()