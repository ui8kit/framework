#!/usr/bin/env node

import { Command } from "commander"
import chalk from "chalk"
import { addCommand } from "./commands/add.js"
import { initCommand } from "./commands/init.js"
import { buildCommand } from "./commands/build.js"
import { scanCommand } from "./commands/scan.js"
import { devCommand } from "./commands/dev.js"

const program = new Command()

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = Array.from({ length: b.length + 1 }, () => [])
  for (let i = 0; i <= b.length; i++) matrix[i][0] = i
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      const cost = a[j - 1] === b[i - 1] ? 0 : 1
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      )
    }
  }
  return matrix[b.length][a.length]
}

function getClosestCommands(input: string, candidates: string[], limit = 3): string[] {
  return [...candidates]
    .map((name) => ({ name, score: levenshtein(input, name) }))
    .sort((a, b) => a.score - b.score)
    .slice(0, limit)
    .map((item) => item.name)
}

program
  .name("ui8kit")
  .description("UI8Kit CLI for component registry and build (init, add, scan, build, dev)")
  .version("1.1.0")
  .showHelpAfterError("(add --help for additional details)")
  .addHelpText(
    "after",
    `
Examples:
  bunx ui8kit@latest init --yes
  bunx ui8kit@latest add button card
  bunx ui8kit@latest scan --cwd ./apps/engine
  bunx ui8kit@latest build ./src/registry.json --output ./packages/registry/r
  bunx ui8kit@latest dev --cwd ./apps/engine

Pipelines:
  Registry maintainer workflow:
    scan -> build
  Brand app workflow:
    init -> add -> dev

For validate, inspect, generate use SDK binaries:
  bunx ui8kit-validate --cwd ./apps/engine
  bunx ui8kit-inspect --cwd ./apps/engine
  bunx ui8kit-generate --cwd ./apps/engine --target react
`
  )

const initCmd = program
  .command("init")
  .description("Initialize UI8Kit structure in your project")
  .option("-y, --yes", "Skip prompts and use defaults")
  .option("-r, --registry <type>", "Registry type: ui", "ui")
  .action(initCommand)
initCmd.addHelpText(
  "after",
  `
Examples:
  bunx ui8kit@latest init
  bunx ui8kit@latest init --yes
  bunx ui8kit@latest init --registry ui
`
)

const addCmd = program
  .command("add")
  .description("Add components to your project from the registry")
  .argument("[components...]", "Components to add")
  .option("-a, --all", "Install all available components")
  .option("-f, --force", "Overwrite existing files")
  .option("-r, --registry <type>", "Registry type: ui", "ui")
  .option("--dry-run", "Show what would be installed without installing")
  .option("--retry", "Enable retry logic for unreliable connections")
  .action(addCommand)
addCmd.addHelpText(
  "after",
  `
Examples:
  bunx ui8kit@latest add button
  bunx ui8kit@latest add button card
  bunx ui8kit@latest add --all
  bunx ui8kit@latest add badge --force
  bunx ui8kit@latest add --all --retry
`
)

const scanCmd = program
  .command("scan")
  .description("Scan and generate registry from existing components")
  .option("-r, --registry <type|path>", "Registry type (ui) or custom path", "ui")
  .option("-o, --output <file>", "Output registry file")
  .option("-s, --source <dir>", "Source directory to scan")
  .option("--cwd <dir>", "Working directory")
  .action(async (options) => {
    await scanCommand(options)
  })
scanCmd.addHelpText(
  "after",
  `
Examples:
  bunx ui8kit@latest scan
  bunx ui8kit@latest scan --cwd ./apps/engine
  bunx ui8kit@latest scan --source ./src --output ./src/registry.json
`
)

const buildCmd = program
  .command("build")
  .description("Build components registry")
  .argument("[registry]", "Path to registry.json file", "./src/registry.json")
  .option("-o, --output <path>", "Output directory", "./packages/registry/r")
  .option("-c, --cwd <cwd>", "Working directory", process.cwd())
  .action(buildCommand)
buildCmd.addHelpText(
  "after",
  `
Examples:
  bunx ui8kit@latest build
  bunx ui8kit@latest build ./src/registry.json
  bunx ui8kit@latest build ./src/registry.json --output ./packages/registry/r
`
)

const devCmd = program
  .command("dev")
  .description("Run Vite dev server for current UI8Kit app")
  .option("--cwd <dir>", "Working directory")
  .action(devCommand)
devCmd.addHelpText(
  "after",
  `
Examples:
  bunx ui8kit@latest dev
  bunx ui8kit@latest dev --cwd ./apps/engine
`
)

const SDK_MOVED = ["validate", "inspect", "generate"]

program.on("command:*", () => {
  const invalid = String(program.args[0] ?? "")
  const available = program.commands.map((cmd) => cmd.name())
  const suggestions = invalid ? getClosestCommands(invalid, available) : []

  console.error(chalk.red(`Invalid command: ${program.args.join(" ")}`))
  if (SDK_MOVED.includes(invalid)) {
    console.log(`'${invalid}' moved to SDK. Use: bunx ui8kit-${invalid} --help`)
  } else if (suggestions.length > 0) {
    console.log(`Did you mean: ${suggestions.map((s) => `'${s}'`).join(", ")}?`)
  }
  if (invalid && !SDK_MOVED.includes(invalid)) {
    console.log(`Try: ui8kit ${invalid} --help`)
  }
  console.log("See --help for a list of available commands.")
  process.exit(1)
})

program.parse() 