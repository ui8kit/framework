/**
 * Vitest Setup File
 * 
 * This file runs before each test file.
 * Use it for global test configuration and utilities.
 */

import { beforeAll, afterAll, beforeEach, afterEach, vi } from 'vitest';

// =============================================================================
// Global Test Configuration
// =============================================================================

// Set test timeout
vi.setConfig({ testTimeout: 30000 });

// =============================================================================
// Global Hooks
// =============================================================================

beforeAll(() => {
  // Global setup before all tests
});

afterAll(() => {
  // Global cleanup after all tests
});

beforeEach(() => {
  // Reset mocks before each test
  vi.clearAllMocks();
});

afterEach(() => {
  // Cleanup after each test
});

// =============================================================================
// Global Test Utilities
// =============================================================================

/**
 * Create a mock logger for testing
 */
export function createMockLogger() {
  return {
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    log: vi.fn(),
  };
}

/**
 * Create a mock file system adapter for testing
 */
export function createMockFileSystem() {
  const files = new Map<string, string>();
  
  return {
    files,
    readFile: vi.fn(async (path: string) => {
      const content = files.get(path);
      if (!content) throw new Error(`ENOENT: no such file or directory, open '${path}'`);
      return content;
    }),
    writeFile: vi.fn(async (path: string, content: string) => {
      files.set(path, content);
    }),
    exists: vi.fn(async (path: string) => files.has(path)),
    mkdir: vi.fn(async () => {}),
    readdir: vi.fn(async (path: string) => {
      const entries: string[] = [];
      for (const key of files.keys()) {
        if (key.startsWith(path)) {
          const relative = key.slice(path.length + 1);
          const firstPart = relative.split('/')[0];
          if (firstPart && !entries.includes(firstPart)) {
            entries.push(firstPart);
          }
        }
      }
      return entries;
    }),
    reset: () => files.clear(),
  };
}

/**
 * Wait for a specified time (useful for async tests)
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Create a deferred promise for testing async flows
 */
export function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason?: unknown) => void;
  
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  
  return { promise, resolve, reject };
}
