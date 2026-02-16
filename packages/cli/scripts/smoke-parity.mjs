import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const repoRoot = resolve(__dirname, '../../..');
const cliDir = resolve(__dirname, '..');

function run(cmd, args, cwd) {
  const nodeOptions = process.env.NODE_OPTIONS
    ? `${process.env.NODE_OPTIONS} --max-old-space-size=4096`
    : '--max-old-space-size=4096';
  const result = spawnSync(cmd, args, {
    cwd,
    stdio: 'pipe',
    encoding: 'utf-8',
    env: {
      ...process.env,
      NODE_OPTIONS: nodeOptions,
    },
  });
  return {
    cmd: `${cmd} ${args.join(' ')}`,
    code: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

function assertSuccess(result, title) {
  if (result.code !== 0) {
    console.error(`FAILED: ${title}`);
    console.error(`Command: ${result.cmd}`);
    console.error(result.stdout);
    console.error(result.stderr);
    process.exit(1);
  }
}

function assertEqual(a, b, title) {
  if (a !== b) {
    console.error(`FAILED: ${title}`);
    console.error(`Left: ${a}`);
    console.error(`Right: ${b}`);
    process.exit(1);
  }
}

const cliBuild = run('bun', ['run', 'build'], cliDir);
assertSuccess(cliBuild, 'Build CLI dist');

const cases = [
  ['inspect-engine', ['inspect', '--cwd', resolve(repoRoot, 'apps/engine')]],
  ['validate-engine', ['validate', '--cwd', resolve(repoRoot, 'apps/engine')]],
  ['inspect-resta', ['inspect', '--cwd', resolve(repoRoot, 'resta-app')]],
  ['validate-resta', ['validate', '--cwd', resolve(repoRoot, 'resta-app')]],
  [
    'generate-resta',
    [
      'generate',
      '--cwd',
      resolve(repoRoot, 'resta-app'),
      '--target',
      'react',
      '--out-dir',
      resolve(repoRoot, 'resta-app/dist/parity'),
    ],
  ],
];

for (const [label, args] of cases) {
  const srcRun = run('bun', ['src/index.ts', ...args], cliDir);
  const distRun = run('bun', ['dist/index.js', ...args], cliDir);
  assertEqual(srcRun.code, distRun.code, `Exit code parity for ${label}`);
  assertSuccess(srcRun, `Source CLI run: ${label}`);
  assertSuccess(distRun, `Dist CLI run: ${label}`);
}

console.log('CLI source/dist parity smoke passed.');
