#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

step() {
  echo ""
  echo "==> $1"
}

run_step() {
  local title="$1"
  local remediation="$2"
  shift 2

  step "$title"
  if "$@"; then
    echo "OK: $title"
  else
    echo "FAILED: $title"
    echo "Remediation: $remediation"
    exit 1
  fi
}

run_step \
  "Typecheck data package" \
  "Resolve TypeScript errors in packages/data before rerun." \
  bash -lc "cd packages/data && bun run typecheck"

run_step \
  "Lint data package" \
  "Fix lint issues in packages/data before rerun." \
  bash -lc "cd packages/data && bun run lint"

run_step \
  "Run data unit tests" \
  "Inspect failing suites and align fixtures/contracts, then rerun." \
  bash -lc "cd packages/data && bun run test"

run_step \
  "Lint engine DSL and types" \
  "Fix type/DSL lint issues in apps/engine before rerun." \
  bash -lc "cd apps/engine && bun run lint"

step "Validate data bundle contract"
if [ -f "apps/dev/src/data/index.ts" ]; then
  if bun run validate:data-bundle -- --target dev; then
    echo "OK: Validate data bundle contract"
  else
    echo "FAILED: Validate data bundle contract"
    echo "Remediation: Align apps/*/src/data and packages/data exports/context contract."
    exit 1
  fi
else
  echo "SKIP: apps/dev/src/data/index.ts not found."
  echo "Remediation: generate/sync a local app bundle, then rerun bundle validation."
fi

step "Docs and domain drift check"
legacy_hits="$(grep -n -E "getDocsSidebarLinks|getExamplesSidebarLinks|page\\.docs|page\\.examples|page\\.dashboard|apps/docs|apps/web|/docs|/examples" \
  packages/data/src/index.test.ts \
  scripts/validate-data-bundle.ts \
  scripts/copy-templates-to-dev.ts \
  README.md \
  packages/data/src/cache.ts || true)"

if [ -n "$legacy_hits" ]; then
  echo "FAILED: Legacy domain references found in synchronized files:"
  echo "$legacy_hits"
  echo "Remediation: replace outdated domains with current model (website/admin) or document intentional exception."
  exit 1
fi
echo "OK: docs and domain drift check"

echo ""
echo "Local quality gate passed."
