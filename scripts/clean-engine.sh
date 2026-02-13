#!/usr/bin/env bash
#
# Clean engine-related development caches/artifacts:
# - apps/engine/node_modules/.vite
# - apps/engine/dist
# - packages/*/dist
# - **/*.tsbuildinfo
#
# Run from repo root:
#   bash scripts/clean-engine.sh
#

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

deleted=0

remove_path() {
  local path="$1"
  if [ -e "$path" ]; then
    rm -rf "$path"
    echo "removed: ${path#"$ROOT"/}"
    deleted=$((deleted + 1))
  fi
}

echo ""
echo "  UI8Kit Engine Cleanup"
echo "  ─────────────────────"
echo ""

# 1) Engine local artifacts
remove_path "$ROOT/apps/engine/node_modules/.vite"
remove_path "$ROOT/apps/engine/dist"

# 2) Package dist outputs
for pkg_dist in "$ROOT"/packages/*/dist; do
  [ -d "$pkg_dist" ] || continue
  remove_path "$pkg_dist"
done

# 3) TypeScript incremental build info
shopt -s globstar nullglob
for tsbuild in "$ROOT"/**/*.tsbuildinfo; do
  [ -f "$tsbuild" ] || continue
  rm -f "$tsbuild"
  echo "removed: ${tsbuild#"$ROOT"/}"
  deleted=$((deleted + 1))
done
shopt -u globstar nullglob

echo ""
echo "Done. Removed $deleted item(s)."
echo ""
