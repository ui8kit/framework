import { beforeEach, describe, expect, it } from 'vitest';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { loadAppConfigDetails } from './config';
import { SDK_CONFIG_VERSION, SDK_SCHEMA_URL } from './constants';

const fixturePath = join(process.cwd(), 'test', 'fixtures', 'legacy-ui8kit.config.json');

describe('config compatibility', () => {
  let sandboxDir: string;

  beforeEach(async () => {
    sandboxDir = join(tmpdir(), `ui8kit-sdk-test-${randomUUID()}`);
    await mkdir(sandboxDir, { recursive: true });
  });

  it('normalizes legacy schema in-memory without mutating config file', async () => {
    const original = await readFile(fixturePath, 'utf-8');
    const targetPath = join(sandboxDir, 'ui8kit.config.json');
    await writeFile(targetPath, original, 'utf-8');

    const loaded = await loadAppConfigDetails(sandboxDir);
    const after = await readFile(targetPath, 'utf-8');

    expect(after).toBe(original);
    expect(loaded.config.$schema).toBe(SDK_SCHEMA_URL);
    expect(loaded.config.configVersion).toBe(SDK_CONFIG_VERSION);
    expect(loaded.warnings.map((w) => w.code)).toContain('LEGACY_SCHEMA_URL');
    expect(loaded.warnings.map((w) => w.code)).toContain('LEGACY_CONFIG_SHAPE');
  });
});
