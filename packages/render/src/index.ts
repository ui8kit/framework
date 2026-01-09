import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { pathToFileURL } from 'url';

export interface RenderOptions {
  entryPath: string; // Path to main.tsx
  routePath: string; // Route to render (e.g., '/', '/about')
}

/**
 * Simple React Renderer based on routeToStatic approach
 */
export class Renderer {
  private importsMap: Map<string, { specifier: string; isNamed: boolean }> = new Map();
  private routesMap: Map<string, string> = new Map();

  /**
   * Render a route to HTML by parsing the router configuration
   */
  async renderRouteToHtml(options: RenderOptions): Promise<string> {
    const { entryPath, routePath } = options;

    try {
      // Parse router configuration
      await this.parseRouterConfig(entryPath);

      // Get component name for this route
      const normalizedPath = this.normalizeRoutePath(routePath);
      const componentName = this.routesMap.get(normalizedPath);

      if (!componentName) {
        console.warn(`⚠️ Route ${routePath} not found in router configuration`);
        //return this.generateFallbackHtml(routePath);
        return '';
      }

      // Load and render component
      const Component = await this.loadComponent(entryPath, componentName);
      if (!Component) {
        console.warn(`⚠️ Component ${componentName} could not be loaded`);
        //return this.generateFallbackHtml(routePath);
        return '';
      }

      // Render component directly (without complex context for now)
      const element = React.createElement(Component);
      return renderToStaticMarkup(element);
    } catch (error) {
      console.error(`❌ Failed to render route ${routePath}:`, error);
      //return this.generateFallbackHtml(routePath);
      return '';
    }
  }

  /**
   * Parse router configuration from entry file
   */
  private async parseRouterConfig(entryPath: string): Promise<void> {
    const absEntryPath = join(process.cwd(), entryPath);
    const fileContent = readFileSync(absEntryPath, 'utf8');

    // Parse imports and routes
    this.importsMap = this.parseImports(fileContent);
    this.routesMap = this.parseRoutes(fileContent);
  }

  /**
   * Parse imports from source code
   */
  private parseImports(source: string): Map<string, { specifier: string; isNamed: boolean }> {
    const map = new Map<string, { specifier: string; isNamed: boolean }>();

    // Default imports: import Component from 'path'
    const defaultImportRegex = /import\s+([A-Za-z0-9_]+)\s+from\s+['"]([^'\"]+)['"];?/g;
    let match: RegExpExecArray | null;
    while ((match = defaultImportRegex.exec(source)) !== null) {
      map.set(match[1], { specifier: match[2], isNamed: false });
    }

    // Named imports: import { Component } from 'path'
    const namedImportRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'\"]+)['"];?/g;
    while ((match = namedImportRegex.exec(source)) !== null) {
      const importsList = match[1];
      const spec = match[2];
      const componentNames = importsList.split(',').map(name => name.trim()).filter(name => name.length > 0);
      for (const name of componentNames) {
        map.set(name, { specifier: spec, isNamed: true });
      }
    }

    return map;
  }

  /**
   * Parse routes from router configuration
   */
  private parseRoutes(source: string): Map<string, string> {
    const map = new Map<string, string>();

    // Extract children array from createBrowserRouter
    const childrenBlockRegex = /children:\s*\[([\s\S]*?)\]/m;
    const blockMatch = childrenBlockRegex.exec(source);
    if (!blockMatch) return map;

    const block = blockMatch[1];

    // Match route entries: { index: true, element: <Home /> } or { path: 'about', element: <About /> }
    const routeEntryRegex = /\{\s*(index:\s*true|path:\s*['"]([^'"]+)['"])\s*,\s*element:\s*<\s*([A-Za-z0-9_]+)\s*\/>/g;
    let match: RegExpExecArray | null;
    while ((match = routeEntryRegex.exec(block)) !== null) {
      const isIndex = match[1] && match[1].includes('index');
      const pathVal = isIndex ? '/' : `/${match[2]}`;
      const componentName = match[3];
      map.set(pathVal, componentName);
    }

    return map;
  }

  /**
   * Load component by name
   */
  private async loadComponent(entryPath: string, componentName: string): Promise<any> {
    const entryDir = dirname(join(process.cwd(), entryPath));
    const importInfo = this.importsMap.get(componentName);

    if (!importInfo) {
      throw new Error(`Import for component ${componentName} not found`);
    }

    const absModulePath = this.resolveImportPath(entryDir, importInfo.specifier);
    const moduleUrl = pathToFileURL(absModulePath).href;
    const mod = await import(moduleUrl);

    return importInfo.isNamed ? mod[componentName] : mod.default;
  }

  /**
   * Resolve import path to file
   */
  private resolveImportPath(entryDir: string, specifier: string): string {
    let base: string;
    if (specifier.startsWith('@/')) {
      base = join(entryDir, specifier.slice(2));
    } else if (specifier.startsWith('./') || specifier.startsWith('../')) {
      base = join(entryDir, specifier);
    } else {
      throw new Error(`Unsupported import specifier: ${specifier}`);
    }

    const candidates = [
      `${base}.tsx`, `${base}.ts`, `${base}.jsx`, `${base}.js`,
      join(base, 'index.tsx'), join(base, 'index.ts'),
      join(base, 'index.jsx'), join(base, 'index.js')
    ];

    for (const candidate of candidates) {
      try {
        readFileSync(candidate);
        return candidate;
      } catch {
        // Continue
      }
    }

    throw new Error(`Unable to resolve file for import ${specifier}`);
  }

  /**
   * Normalize route path
   */
  private normalizeRoutePath(routePath: string): string {
    return routePath === '/' ? '/' : (routePath.startsWith('/') ? routePath : `/${routePath}`);
  }

  /**
   * Generate fallback HTML
  private generateFallbackHtml(routePath: string): string {
    return `<div data-class="page-fallback">
  <div data-class="page-header">
    <h1 data-class="page-title">Page: ${routePath}</h1>
  </div>
  <div data-class="page-content">
    <p data-class="page-description">Content for ${routePath} could not be loaded.</p>
  </div>
</div>`;
  }
   */
}

/**
 * Convenience function for rendering
 */
export async function renderRoute(options: RenderOptions): Promise<string> {
  const renderer = new Renderer();
  return renderer.renderRouteToHtml(options);
}
