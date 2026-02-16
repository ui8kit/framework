#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export NODE_OPTIONS="${NODE_OPTIONS:-} --max-old-space-size=4096"

ENGINE_OUT="dist/integration-react"
RESTA_OUT="dist/integration-react"

echo "==> SDK integration checks (engine + resta)"

echo "-> inspect engine"
bun "packages/cli/src/index.ts" inspect --cwd "apps/engine"

echo "-> validate engine"
bun "packages/cli/src/index.ts" validate --cwd "apps/engine"

echo "-> generate engine react"
bun "packages/cli/src/index.ts" generate --cwd "apps/engine" --target react --out-dir "$ENGINE_OUT"

echo "-> inspect resta"
bun "packages/cli/src/index.ts" inspect --cwd "resta-app"

echo "-> validate resta"
bun "packages/cli/src/index.ts" validate --cwd "resta-app"

echo "-> generate resta react"
bun "packages/cli/src/index.ts" generate --cwd "resta-app" --target react --out-dir "$RESTA_OUT"

if [ ! -d "apps/engine/$ENGINE_OUT" ] || [ ! -d "resta-app/$RESTA_OUT" ]; then
  echo "ERROR: expected output directories missing"
  exit 1
fi

ENGINE_FILES=$(node -e "const fs=require('fs');const p='apps/engine/$ENGINE_OUT';let c=0;const walk=(d)=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=d+'/'+e.name;if(e.isDirectory())walk(f);else c++;}};walk(p);console.log(c);")
RESTA_FILES=$(node -e "const fs=require('fs');const p='resta-app/$RESTA_OUT';let c=0;const walk=(d)=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=d+'/'+e.name;if(e.isDirectory())walk(f);else c++;}};walk(p);console.log(c);")

if [ "${ENGINE_FILES:-0}" -lt 5 ]; then
  echo "ERROR: engine generated too few files: $ENGINE_FILES"
  exit 1
fi

if [ "${RESTA_FILES:-0}" -lt 1 ]; then
  echo "ERROR: resta generated too few files: $RESTA_FILES"
  exit 1
fi

if node -e "const fs=require('fs');const roots=['apps/engine/$ENGINE_OUT','resta-app/$RESTA_OUT'];const needles=['<If','<Loop','<Var','@ui8kit/template','data-gen-'];let bad=false;const walk=(d)=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=d+'/'+e.name;if(e.isDirectory())walk(f);else{const t=fs.readFileSync(f,'utf8');if(needles.some(n=>t.includes(n))){bad=true;}}}};for(const r of roots){walk(r);}process.exit(bad?0:1);"; then
  echo "ERROR: DSL residue detected in generated outputs"
  exit 1
fi

echo "SDK integration checks passed."
