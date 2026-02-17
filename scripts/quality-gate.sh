#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
WARN_COUNT=0

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

run_optional_step() {
  local title="$1"
  local remediation="$2"
  shift 2

  step "$title"
  if "$@"; then
    echo "OK: $title"
  else
    echo "WARN: $title"
    echo "Remediation: $remediation"
    WARN_COUNT=$((WARN_COUNT + 1))
  fi
}

run_step \
  "Lint and typecheck apps/engine (DSL enforced)" \
  "Fix type or DSL issues in apps/engine before rerun." \
  bash -lc "cd apps/engine && bun run lint"

run_step \
  "Typecheck packages/core" \
  "Resolve TypeScript issues in packages/core/tsconfig.json before rerun." \
  bunx tsc --noEmit -p packages/core/tsconfig.json

run_step \
  "Typecheck packages/data" \
  "Resolve TypeScript issues in packages/data before rerun." \
  bash -lc "cd packages/data && bun run typecheck"

run_step \
  "Lint packages/data" \
  "Fix lint issues in packages/data before rerun." \
  bash -lc "cd packages/data && bun run lint"

run_step \
  "Run tests packages/data" \
  "Inspect failing suites in packages/data and align fixtures/contracts." \
  bash -lc "cd packages/data && bun run test"

run_optional_step \
  "Lint packages/generator" \
  "Fix type/lint issues in packages/generator; currently non-blocking to keep local flow stable." \
  bash -lc "cd packages/generator && bun run lint"

run_step \
  "Run tests packages/generator" \
  "Inspect generator test failures and update implementation/tests." \
  bash -lc "cd packages/generator && bun run test"

run_optional_step \
  "Lint packages/template" \
  "Fix type/lint issues in packages/template; currently non-blocking to keep local flow stable." \
  bash -lc "cd packages/template && bun run lint"

run_step \
  "Run tests packages/template" \
  "Inspect template test failures and update implementation/tests." \
  bash -lc "cd packages/template && bun run test"

run_optional_step \
  "Lint packages/lint" \
  "Fix type/lint issues in packages/lint; currently non-blocking to keep local flow stable." \
  bash -lc "cd packages/lint && bun run lint"

run_step \
  "Run tests packages/lint" \
  "Inspect lint package test failures and update implementation/tests." \
  bash -lc "cd packages/lint && bun run test"

run_optional_step \
  "Lint packages/blocks (known baseline debt allowed)" \
  "Address blocks tsconfig/path mapping debt; move this step to mandatory when clean." \
  bash -lc "cd packages/blocks && bun run lint"

run_optional_step \
  "Run tests apps/engine (optional until tests exist)" \
  "Add engine tests or configure test include; then make this mandatory." \
  bash -lc "cd apps/engine && bun run test"

run_optional_step \
  "Run e2e smoke apps/engine (optional until stabilized)" \
  "Install Playwright browsers and stabilize smoke tests before making this mandatory." \
  bash -lc "cd apps/engine && bun run e2e"

run_optional_step \
  "SDK integration checks (engine + resta)" \
  "Inspect CLI SDK commands and generated output parity for engine/resta projects." \
  bun run check:sdk-integration

run_step \
  "Validate architecture invariants" \
  "Fix invariant violations for routes, domains, fixtures, and terminology." \
  bun run validate:invariants

step "Refactor audit trail (non-blocking in quality gate)"
if bun run audit:refactor; then
  echo "OK: refactor audit report generated"
else
  echo "WARN: refactor audit command failed"
  echo "Remediation: check mapping file and script runtime; rerun bun run audit:refactor."
  WARN_COUNT=$((WARN_COUNT + 1))
fi

echo ""
echo "Warnings: $WARN_COUNT"
echo "Local quality gate passed."
