#!/usr/bin/env bash
#
# Full development cleanup across the workspace:
# - **/node_modules
# - **/dist
# - **/*.tsbuildinfo
# - **/debug.log
# - **/bun.lock
# - **/.turbo
#
# Run from repo root:
#   bash scripts/clean-workspace.sh
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

remove_file() {
  local path="$1"
  if [ -f "$path" ]; then
    rm -f "$path"
    echo "removed: ${path#"$ROOT"/}"
    deleted=$((deleted + 1))
  fi
}

echo ""
echo "  UI8Kit Workspace Cleanup"
echo "  ────────────────────────"
echo ""

shopt -s globstar nullglob

# 1) Folder cleanup
for dir in "$ROOT"/**/node_modules "$ROOT"/**/dist "$ROOT"/**/.turbo; do
  [ -d "$dir" ] || continue
  remove_path "$dir"
done

# 2) File cleanup
for file in "$ROOT"/**/*.tsbuildinfo "$ROOT"/**/debug.log "$ROOT"/**/bun.lock; do
  [ -f "$file" ] || continue
  remove_file "$file"
done

shopt -u globstar nullglob

echo ""
echo "Done. Removed $deleted item(s)."
echo ""
