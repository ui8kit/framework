import chalk from 'chalk';
import { loadAppConfig } from '@ui8kit/sdk/source/config';
import { validateProject } from '@ui8kit/sdk/source/validate';

interface ValidateOptions {
  cwd?: string;
}

export async function validateCommand(options: ValidateOptions = {}) {
  const cwd = options.cwd ?? process.cwd();

  try {
    const config = await loadAppConfig(cwd);
    const result = await validateProject(config, cwd);

    if (result.diagnostics.length > 0) {
      console.log(chalk.yellow('\nProject diagnostics:'));
      for (const item of result.diagnostics) {
        const marker = item.severity === 'error' ? chalk.red('error') : chalk.yellow('warn');
        console.log(` - ${marker} ${item.code}: ${item.message}`);
      }
    }

    if (result.dslErrors.length > 0) {
      console.log(chalk.yellow('\nDSL validation errors:'));
      for (const error of result.dslErrors) {
        const location = error.location?.file ? ` (${error.location.file})` : '';
        console.log(` - ${chalk.red(error.error_code)}: ${error.message}${location}`);
      }
    }

    if (!result.ok) {
      console.log(chalk.red('\nValidation failed.'));
      process.exit(1);
    }

    console.log(chalk.green('Validation passed.'));
  } catch (error) {
    console.error(chalk.red('Validation failed:'), (error as Error).message);
    process.exit(1);
  }
}
