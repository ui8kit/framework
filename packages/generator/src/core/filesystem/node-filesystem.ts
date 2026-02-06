/**
 * Node.js FileSystem Implementation
 *
 * Uses native fs/promises for file operations.
 */

import {
  readFile as fsReadFile,
  writeFile as fsWriteFile,
  mkdir as fsMkdir,
  readdir as fsReaddir,
  stat as fsStat,
} from 'fs/promises';
import * as path from 'path';
import type { Dirent } from 'fs';
import type { IFileSystem, FileStat } from './filesystem';

/**
 * Node.js implementation of IFileSystem
 */
export class NodeFileSystem implements IFileSystem {
  async readFile(filePath: string, encoding = 'utf-8'): Promise<string> {
    return fsReadFile(filePath, encoding);
  }

  async writeFile(filePath: string, content: string): Promise<void> {
    return fsWriteFile(filePath, content, 'utf-8');
  }

  async mkdir(dirPath: string, options?: { recursive?: boolean }): Promise<void> {
    return fsMkdir(dirPath, options);
  }

  async readdir(
    dirPath: string,
    options?: { withFileTypes?: boolean }
  ): Promise<string[] | Dirent[]> {
    return fsReaddir(dirPath, options as any);
  }

  async stat(filePath: string): Promise<FileStat> {
    const stats = await fsStat(filePath);
    return {
      isFile: () => stats.isFile(),
      isDirectory: () => stats.isDirectory(),
    };
  }

  async exists(filePath: string): Promise<boolean> {
    try {
      await fsStat(filePath);
      return true;
    } catch {
      return false;
    }
  }

  resolve(...paths: string[]): string {
    return path.resolve(...paths);
  }

  relative(from: string, to: string): string {
    return path.relative(from, to);
  }

  dirname(filePath: string): string {
    return path.dirname(filePath);
  }

  basename(filePath: string, ext?: string): string {
    return path.basename(filePath, ext);
  }

  extname(filePath: string): string {
    return path.extname(filePath);
  }

  join(...paths: string[]): string {
    return path.join(...paths);
  }
}

/**
 * Create a Node.js filesystem instance
 */
export function createNodeFileSystem(): IFileSystem {
  return new NodeFileSystem();
}
