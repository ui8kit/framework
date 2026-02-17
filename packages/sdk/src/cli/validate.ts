#!/usr/bin/env bun

import { Command } from "commander";
import chalk from "chalk";
import { loadAppConfigDetails } from "../config";
import { validateProject } from "../validate";

const program = new Command();

program
  .name("ui8kit-validate")
  .description("Validate UI8Kit app config and DSL")
  .option("--cwd <dir>", "Working directory", process.cwd())
  .addHelpText(
    "after",
    `
Examples:
  bunx ui8kit-validate
  bunx ui8kit-validate --cwd ./apps/engine
`
  )
  .action(async (options: { cwd?: string }) => {
    const cwd = options.cwd ?? process.cwd();

    try {
      const loaded = await loadAppConfigDetails(cwd);
      const result = await validateProject(loaded.config, cwd);

      if (loaded.warnings.length > 0) {
        console.log(chalk.yellow("\nConfig compatibility warnings:"));
        for (const warning of loaded.warnings) {
          console.log(` - ${warning.code}: ${warning.message}`);
        }
      }

      if (result.diagnostics.length > 0) {
        console.log(chalk.yellow("\nProject diagnostics:"));
        for (const item of result.diagnostics) {
          const marker =
            item.severity === "error" ? chalk.red("error") : chalk.yellow("warn");
          console.log(` - ${marker} ${item.code}: ${item.message}`);
        }
      }

      if (result.dslErrors.length > 0) {
        console.log(chalk.yellow("\nDSL validation errors:"));
        for (const error of result.dslErrors) {
          const location = error.location?.file
            ? ` (${error.location.file})`
            : "";
          console.log(
            ` - ${chalk.red(error.error_code)}: ${error.message}${location}`
          );
        }
      }

      if (!result.ok) {
        console.log(chalk.red("\nValidation failed."));
        process.exit(1);
      }

      console.log(chalk.green("Validation passed."));
    } catch (error) {
      console.error(
        chalk.red("Validation failed:"),
        (error as Error).message
      );
      process.exit(1);
    }
  });

program.parse();
