import chalk from 'chalk';
import { execa } from 'execa';
import { loadAppConfig } from '@ui8kit/sdk/source/config';

interface DevOptions {
  cwd?: string;
}

export async function devCommand(options: DevOptions = {}) {
  const cwd = options.cwd ?? process.cwd();

  try {
    await loadAppConfig(cwd);
  } catch (error) {
    console.error(chalk.red('Cannot start dev server:'), (error as Error).message);
    process.exit(1);
  }

  console.log(chalk.blue('Starting Vite dev server...'));
  const child = execa('vite', [], { cwd, stdio: 'inherit' });
  await child;
}
