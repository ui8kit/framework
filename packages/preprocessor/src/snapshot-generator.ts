import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'url';

interface SnapshotOptions {
  verbose?: boolean;
}

/**
 * Generate HTML snapshots for routes using React static rendering
 * Simplified version of routeToStatic logic, focused only on HTML generation
 */
export class SnapshotGenerator {
  private snapDir: string;
  private appName: string;

  constructor(snapDir = '~snap', appName = 'local') {
    this.snapDir = snapDir;
    this.appName = appName;
  }

  /**
   * Generate HTML snapshot for a specific route
   */
  async generateRouteSnapshot(
    routePath: string,
    entryPath: string,
    options: SnapshotOptions = {}
  ): Promise<string> {
    const { verbose = false } = options;

    if (verbose) {
      console.log(`📸 Generating snapshot for route: ${routePath}`);
    }

    // Resolve the route component
    const RouteComponent = await this.resolveRouteComponent(entryPath, routePath);

    // Create minimal HTML wrapper (just the body content)
    const htmlContent = this.renderRouteToHtml(RouteComponent);

    // Save to snapshot directory
    const snapshotPath = this.getSnapshotPath(routePath);
    const snapshotDir = dirname(snapshotPath);

    if (!existsSync(snapshotDir)) {
      mkdirSync(snapshotDir, { recursive: true });
    }

    writeFileSync(snapshotPath, htmlContent, 'utf-8');

    if (verbose) {
      console.log(`✅ Saved snapshot: ${snapshotPath}`);
    }

    return snapshotPath;
  }

  /**
   * Render route component to HTML string
   * For now, returns placeholder - actual implementation would use React rendering
   */
  private renderRouteToHtml(RouteComponent: any): string {
    // Placeholder implementation - in real usage, this would render React components
    // For now, we use pre-existing HTML snapshots
    throw new Error('React rendering not implemented in this simplified version. Use existing HTML snapshots.');
  }

  /**
   * Resolve route component from entry file using router configuration
   */
  private async resolveRouteComponent(entryPath: string, routePath: string): Promise<any> {
    // Import the main entry file to get access to the router configuration
    const entryDir = dirname(entryPath);
    const moduleUrl = pathToFileURL(entryPath).href;

    try {
      const entryModule = await import(moduleUrl);

      // For now, use a simple approach - import routes directly
      // In a full implementation, we'd parse createBrowserRouter configuration
      const routeMappings: Record<string, () => Promise<any>> = {
        '/': async () => {
          const homeModule = await import(pathToFileURL(join(entryDir, 'routes', 'HomePage.tsx')).href);
          return homeModule.HomePage;
        }
      };

      const routeLoader = routeMappings[routePath];
      if (!routeLoader) {
        throw new Error(`No route mapping found for: ${routePath}`);
      }

      return await routeLoader();
    } catch (error) {
      throw new Error(`Failed to resolve route component for ${routePath}: ${error}`);
    }
  }

  /**
   * Get snapshot file path for a route
   */
  private getSnapshotPath(routePath: string): string {
    // Normalize route path for filesystem (remove leading slash, handle root)
    const normalizedPath = routePath === '/' ? 'index' : routePath.slice(1);
    return join(this.snapDir, this.appName, `${normalizedPath}.html`);
  }
}

// Export singleton instance
export const snapshotGenerator = new SnapshotGenerator();
