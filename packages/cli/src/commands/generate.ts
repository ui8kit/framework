import chalk from 'chalk';
import { loadAppConfig } from '@ui8kit/sdk/source/config';
import { buildProject } from '@ui8kit/sdk/source/build';

interface GenerateOptions {
  cwd?: string;
  outDir?: string;
  target?: 'react' | 'liquid' | 'handlebars' | 'twig' | 'latte';
}

export async function generateCommand(options: GenerateOptions = {}) {
  const cwd = options.cwd ?? process.cwd();

  try {
    const config = await loadAppConfig(cwd);
    const runtimeConfig = {
      ...config,
      ...(options.outDir ? { outDir: options.outDir } : {}),
      ...(options.target ? { target: options.target } : {}),
    };

    const result = await buildProject(runtimeConfig, cwd);
    if (!result.ok) {
      console.log(chalk.red('Generation failed.'));
      for (const error of result.errors) {
        console.log(` - ${error}`);
      }
      process.exit(1);
    }

    console.log(chalk.green('Generation completed.'));
    console.log(`Engine: ${result.engine}`);
    console.log(`Output: ${result.outputDir}`);
    console.log(`Files: ${result.generated}`);
    if (result.warnings.length > 0) {
      console.log(chalk.yellow('\nWarnings:'));
      for (const warning of result.warnings) {
        console.log(` - ${warning}`);
      }
    }
  } catch (error) {
    console.error(chalk.red('Generation failed:'), (error as Error).message);
    process.exit(1);
  }
}
