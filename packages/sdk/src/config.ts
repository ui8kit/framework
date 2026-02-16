import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { appConfigSchema } from './schema';
import type { AppConfig } from './types';

const CONFIG_CANDIDATES = [
  'ui8kit.config.ts',
  'ui8kit.config.mts',
  'ui8kit.config.js',
  'ui8kit.config.mjs',
  'ui8kit.config.cjs',
  'ui8kit.config.json',
] as const;

async function exists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function findAppConfigPath(cwd = process.cwd()): Promise<string | undefined> {
  for (const candidate of CONFIG_CANDIDATES) {
    const fullPath = resolve(cwd, candidate);
    if (await exists(fullPath)) return fullPath;
  }
  return undefined;
}

export async function loadAppConfig(cwd = process.cwd()): Promise<AppConfig> {
  const configPath = await findAppConfigPath(cwd);
  if (!configPath) {
    throw new Error('ui8kit.config.* not found in project root');
  }

  if (configPath.endsWith('.json')) {
    const raw = await readFile(configPath, 'utf-8');
    const parsed = JSON.parse(raw);
    return appConfigSchema.parse(parsed);
  }

  const moduleUrl = pathToFileURL(configPath).href;
  const mod = await import(moduleUrl);
  const config = mod.default ?? mod.config ?? mod;
  return appConfigSchema.parse(config);
}

export function defineApp(config: AppConfig): AppConfig {
  return appConfigSchema.parse(config);
}
