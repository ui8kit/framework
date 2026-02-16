import type { LintError } from '@ui8kit/lint';

export type BuildTarget = 'react' | 'liquid' | 'handlebars' | 'twig' | 'latte';

export interface AppConfig {
  $schema?: string;
  configVersion?: string;
  brand: string;
  framework: 'vite-react';
  typescript?: boolean;
  target: BuildTarget;
  outDir?: string;
  aliases: Record<string, string>;
  fixtures: string;
  tokens: string;
  componentsDir: string;
  blocksDir?: string;
  layoutsDir?: string;
  partialsDir?: string;
  libDir: string;
  registry?: string;
  lint?: {
    strict?: boolean;
    dsl?: boolean;
  };
}

export interface ConfigLoadWarning {
  code: 'LEGACY_SCHEMA_URL' | 'LEGACY_CONFIG_SHAPE';
  message: string;
}

export interface LoadedAppConfig {
  config: AppConfig;
  configPath: string;
  warnings: ConfigLoadWarning[];
}

export interface ValidationIssue {
  code: string;
  message: string;
  file?: string;
  severity: 'error' | 'warning';
}

export interface ValidateResult {
  ok: boolean;
  diagnostics: ValidationIssue[];
  dslErrors: LintError[];
}

export interface BuildResult {
  ok: boolean;
  generated: number;
  outputDir: string;
  engine: BuildTarget;
  errors: string[];
  warnings: string[];
}
