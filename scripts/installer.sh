#!/usr/bin/env bash
#
# Install a new UI8Kit app from scaffold config.
# 1. Scaffold app (vite, tsconfig, postcss, css, etc.)
# 2. bun install
# 3. Engine generate
# 4. Copy templates to target app
#
# Config: scripts/app-scaffold.config.json (appName, target, etc.)
#
# Run from repo root:
#   bash scripts/installer.sh
#

set -e

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

echo ""
echo "  UI8Kit App Installer"
echo "  ───────────────────"
echo ""

# 1. Scaffold
echo "  1. Scaffolding app..."
bun run scripts/scaffold-app.ts
echo ""

# 2. Install packages
echo "  2. Running bun install..."
bun install
echo ""

# 3. Engine generate
echo "  3. Generating engine templates..."
cd "$ROOT/apps/engine"
bun run generate
cd "$ROOT"
echo ""

# 4. Copy to target (read from config)
TARGET_APP=$(bun run scripts/scaffold-config.ts --field appName)
TARGET_APP=${TARGET_APP:-test}
DOMAIN=$(bun run scripts/scaffold-config.ts --field domain)
DOMAIN=${DOMAIN:-website}
echo "  4. Copying templates to apps/$TARGET_APP (from domain: $DOMAIN)..."
TARGET_APP="$TARGET_APP" DOMAIN="$DOMAIN" bun run scripts/copy-templates-to-dev.ts --target "$TARGET_APP" --domain "$DOMAIN"
echo ""

echo "  Done. Run: cd apps/$TARGET_APP && bun run dev"
echo ""
