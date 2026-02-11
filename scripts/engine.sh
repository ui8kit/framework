#!/usr/bin/env bash
set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"

cd "$ROOT/apps/engine"
bun run generate

cd "$ROOT"
bun run scripts/copy-templates-to-dev.ts