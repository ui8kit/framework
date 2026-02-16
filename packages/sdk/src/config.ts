import { access, readFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { appConfigSchema } from './schema';
import { SDK_CONFIG_VERSION, SDK_LEGACY_SCHEMA_URLS, SDK_SCHEMA_URL } from './constants';
import type { AppConfig, ConfigLoadWarning, LoadedAppConfig } from './types';

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
  const loaded = await loadAppConfigDetails(cwd);
  return loaded.config;
}

function normalizeLegacyConfig(rawConfig: unknown): { config: unknown; warnings: ConfigLoadWarning[] } {
  const warnings: ConfigLoadWarning[] = [];
  if (typeof rawConfig !== 'object' || rawConfig === null) {
    return { config: rawConfig, warnings };
  }

  const configRecord = { ...(rawConfig as Record<string, unknown>) };
  const schemaValue = configRecord.$schema;
  if (typeof schemaValue === 'string' && SDK_LEGACY_SCHEMA_URLS.includes(schemaValue as (typeof SDK_LEGACY_SCHEMA_URLS)[number])) {
    warnings.push({
      code: 'LEGACY_SCHEMA_URL',
      message: `Legacy schema URL detected (${schemaValue}). Normalized to ${SDK_SCHEMA_URL}.`,
    });
    configRecord.$schema = SDK_SCHEMA_URL;
  }

  if (!('configVersion' in configRecord)) {
    warnings.push({
      code: 'LEGACY_CONFIG_SHAPE',
      message: `configVersion was not set. Defaulting to ${SDK_CONFIG_VERSION}.`,
    });
    configRecord.configVersion = SDK_CONFIG_VERSION;
  }

  return { config: configRecord, warnings };
}

export async function loadAppConfigDetails(cwd = process.cwd()): Promise<LoadedAppConfig> {
  const configPath = await findAppConfigPath(cwd);
  if (!configPath) {
    throw new Error('ui8kit.config.* not found in project root');
  }

  let rawConfig: unknown;
  let warnings: ConfigLoadWarning[] = [];

  if (configPath.endsWith('.json')) {
    const raw = await readFile(configPath, 'utf-8');
    const parsed = JSON.parse(raw);
    const normalized = normalizeLegacyConfig(parsed);
    rawConfig = normalized.config;
    warnings = normalized.warnings;
  } else {
    const moduleUrl = pathToFileURL(configPath).href;
    const mod = await import(moduleUrl);
    const config = mod.default ?? mod.config ?? mod;
    const normalized = normalizeLegacyConfig(config);
    rawConfig = normalized.config;
    warnings = normalized.warnings;
  }

  return {
    config: appConfigSchema.parse(rawConfig),
    configPath,
    warnings,
  };
}

export function defineApp(config: AppConfig): AppConfig {
  return appConfigSchema.parse(config);
}
