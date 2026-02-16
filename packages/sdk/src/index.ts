export { defineApp, findAppConfigPath, loadAppConfig } from './config';
export { validateProject } from './validate';
export { buildProject } from './build';
export type { AppConfig, BuildResult, BuildTarget, ValidateResult, ValidationIssue } from './types';
export { appConfigSchema } from './schema';

export * from '@ui8kit/template/source';
export * from '@ui8kit/lint/source';
export * from '@ui8kit/generator/source';
export * from '@ui8kit/data-contracts/source';
