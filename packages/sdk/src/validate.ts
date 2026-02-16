import { readFile } from 'node:fs/promises';
import { access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';
import { glob } from 'glob';
import { validateDSL } from '@ui8kit/lint/source';
import type { AppConfig, ValidateResult, ValidationIssue } from './types';

async function pathExists(path: string): Promise<boolean> {
  try {
    await access(path, constants.F_OK);
    return true;
  } catch {
    return false;
  }
}

export async function validateProject(config: AppConfig, cwd = process.cwd()): Promise<ValidateResult> {
  const diagnostics: ValidationIssue[] = [];
  const dslErrors = [];

  const requiredPaths = [
    { key: 'fixtures', value: config.fixtures },
    { key: 'tokens', value: config.tokens },
    { key: 'componentsDir', value: config.componentsDir },
    { key: 'libDir', value: config.libDir },
    ...(config.blocksDir ? [{ key: 'blocksDir', value: config.blocksDir }] : []),
    ...(config.layoutsDir ? [{ key: 'layoutsDir', value: config.layoutsDir }] : []),
    ...(config.partialsDir ? [{ key: 'partialsDir', value: config.partialsDir }] : []),
  ];

  for (const { key, value } of requiredPaths) {
    const absolute = resolve(cwd, value);
    if (!(await pathExists(absolute))) {
      diagnostics.push({
        code: 'MISSING_PATH',
        message: `Configured path does not exist: ${key} -> ${value}`,
        file: absolute,
        severity: 'error',
      });
    }
  }

  if (config.lint?.dsl !== false) {
    const candidateDirs = [
      config.blocksDir,
      config.layoutsDir,
      config.partialsDir,
    ].filter(Boolean) as string[];

    for (const dir of candidateDirs) {
      const dirPath = resolve(cwd, dir);
      if (!(await pathExists(dirPath))) continue;
      const files = await glob('**/*.{tsx,jsx}', { cwd: dirPath, absolute: true });

      for (const filePath of files) {
        const source = await readFile(filePath, 'utf-8');
        const result = validateDSL(source, {
          file: filePath,
          strict: config.lint?.strict ?? false,
        });
        if (!result.valid) {
          dslErrors.push(...result.errors);
        }
      }
    }
  }

  return {
    ok: diagnostics.length === 0 && dslErrors.length === 0,
    diagnostics,
    dslErrors,
  };
}
