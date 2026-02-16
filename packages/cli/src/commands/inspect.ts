import chalk from 'chalk';
import { loadAppConfigDetails } from '@ui8kit/sdk/source/config';

interface InspectOptions {
  cwd?: string;
}

export async function inspectCommand(options: InspectOptions = {}) {
  const cwd = options.cwd ?? process.cwd();

  try {
    const loaded = await loadAppConfigDetails(cwd);
    const config = loaded.config;

    console.log(chalk.blue('UI8Kit project inspection'));
    console.log(`Config path: ${loaded.configPath}`);
    console.log(`Schema: ${config.$schema ?? '(not set)'}`);
    console.log(`Config version: ${config.configVersion ?? '(not set)'}`);
    console.log(`Brand: ${config.brand}`);
    console.log(`Framework: ${config.framework}`);
    console.log(`Target: ${config.target}`);
    console.log(`Output dir: ${config.outDir ?? `dist/${config.target}`}`);
    console.log(`Fixtures: ${config.fixtures}`);
    console.log(`Tokens: ${config.tokens}`);
    console.log(`Components: ${config.componentsDir}`);
    console.log(`Blocks: ${config.blocksDir ?? '(not set)'}`);
    console.log(`Layouts: ${config.layoutsDir ?? '(not set)'}`);
    console.log(`Partials: ${config.partialsDir ?? '(not set)'}`);
    console.log(`Lib: ${config.libDir}`);
    console.log(`Registry: ${config.registry ?? '@ui8kit'}`);
    if (loaded.warnings.length > 0) {
      console.log(chalk.yellow('\nConfig compatibility warnings:'));
      for (const warning of loaded.warnings) {
        console.log(` - ${warning.code}: ${warning.message}`);
      }
    }
  } catch (error) {
    console.error(chalk.red('Inspect failed:'), (error as Error).message);
    process.exit(1);
  }
}
