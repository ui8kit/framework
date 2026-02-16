#!/usr/bin/env node

import { Command } from "commander"
import chalk from "chalk"
import { addCommand } from "./commands/add.js"
import { initCommand } from "./commands/init.js"
import { buildCommand } from "./commands/build.js"
import { scanCommand } from "./commands/scan.js"
import { validateCommand } from "./commands/validate.js"
import { devCommand } from "./commands/dev.js"
import { generateCommand } from "./commands/generate.js"
import { inspectCommand } from "./commands/inspect.js"

const program = new Command()

program
  .name("ui8kit")
  .description("A CLI for adding UI components to your Vite React projects (UI8Kit registry)")
  .version("1.1.0")

program
  .command("init")
  .description("Initialize UI8Kit structure in your project")
  .option("-y, --yes", "Skip prompts and use defaults")
  .option("-r, --registry <type>", "Registry type: ui", "ui")
  .action(initCommand)

program
  .command("add")
  .description("Add components to your project from the registry")
  .argument("[components...]", "Components to add")
  .option("-a, --all", "Install all available components")
  .option("-f, --force", "Overwrite existing files")
  .option("-r, --registry <type>", "Registry type: ui", "ui")
  .option("--dry-run", "Show what would be installed without installing")
  .option("--retry", "Enable retry logic for unreliable connections")
  .action(addCommand)

program
  .command("scan")
  .description("Scan and generate registry from existing components")
  .option("-r, --registry <type|path>", "Registry type (ui) or custom path", "ui")
  .option("-o, --output <file>", "Output registry file")
  .option("-s, --source <dir>", "Source directory to scan")
  .option("--cwd <dir>", "Working directory")
  .action(async (options) => {
    await scanCommand(options)
  })

program
  .command("build")
  .description("Build components registry")
  .argument("[registry]", "Path to registry.json file", "./src/registry.json")
  .option("-o, --output <path>", "Output directory", "./packages/registry/r")
  .option("-c, --cwd <cwd>", "Working directory", process.cwd())
  .action(buildCommand)

program
  .command("validate")
  .description("Validate UI8Kit app config and DSL")
  .option("--cwd <dir>", "Working directory")
  .action(validateCommand)

program
  .command("dev")
  .description("Run Vite dev server for current UI8Kit app")
  .option("--cwd <dir>", "Working directory")
  .action(devCommand)

program
  .command("generate")
  .description("Generate target templates using SDK")
  .option("--cwd <dir>", "Working directory")
  .option("--out-dir <dir>", "Output directory override")
  .option("--target <engine>", "Target engine: react|liquid|handlebars|twig|latte")
  .action(generateCommand)

program
  .command("inspect")
  .description("Inspect resolved UI8Kit app config")
  .option("--cwd <dir>", "Working directory")
  .action(inspectCommand)

program.on("command:*", () => {
  console.error(chalk.red(`Invalid command: ${program.args.join(" ")}`))
  console.log("See --help for a list of available commands.")
  process.exit(1)
})

program.parse() 