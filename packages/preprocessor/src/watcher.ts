import { watch } from 'fs';

export interface WatcherOptions {
  verbose?: boolean;
}

/**
 * Watch for file changes and trigger rebuild
 */
export function watchFiles(
  srcDir: string,
  onChange: () => void,
  options: WatcherOptions = {}
): void {
  const { verbose = false } = options;

  const watcher = watch(srcDir, { recursive: true }, (eventType, filename) => {
    if (filename && isRelevantFile(filename)) {
      if (verbose) {
        console.log(`🔄 File changed: ${filename}`);
      }
      onChange();
    }
  });

  // Handle watcher errors
  watcher.on('error', (error) => {
    console.error('❌ Watcher error:', error);
  });

  // Graceful shutdown
  process.on('SIGINT', () => {
    watcher.close();
    process.exit(0);
  });
}

/**
 * Check if file change should trigger rebuild
 */
function isRelevantFile(filename: string): boolean {
  // Only watch TypeScript/React files
  const relevantExtensions = ['.ts', '.tsx', '.jsx', '.js'];
  const ext = filename.split('.').pop();

  return relevantExtensions.includes(`.${ext}`);
}
