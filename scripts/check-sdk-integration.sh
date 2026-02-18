#!/usr/bin/env bash

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export NODE_OPTIONS="${NODE_OPTIONS:-} --max-old-space-size=4096"

ENGINE_OUT="dist/integration-react"

echo "==> SDK integration checks (engine)"

echo "-> inspect engine"
bun packages/sdk/src/cli/inspect.ts --cwd "apps/engine"

echo "-> validate engine"
bun packages/sdk/src/cli/validate.ts --cwd "apps/engine"

echo "-> generate engine react"
bun packages/generator/src/cli/generate.ts --cwd "apps/engine" --target react --out-dir "$ENGINE_OUT"

if [ ! -d "apps/engine/$ENGINE_OUT" ]; then
  echo "ERROR: expected output directory missing: apps/engine/$ENGINE_OUT"
  exit 1
fi

ENGINE_FILES=$(node -e "const fs=require('fs');const p='apps/engine/$ENGINE_OUT';let c=0;const walk=(d)=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=d+'/'+e.name;if(e.isDirectory())walk(f);else c++;}};walk(p);console.log(c);")

if [ "${ENGINE_FILES:-0}" -lt 5 ]; then
  echo "ERROR: engine generated too few files: $ENGINE_FILES"
  exit 1
fi

if node -e "const fs=require('fs');const roots=['apps/engine/$ENGINE_OUT'];const needles=['<If','<Loop','<Var','@ui8kit/template','data-gen-'];let bad=false;const walk=(d)=>{for(const e of fs.readdirSync(d,{withFileTypes:true})){const f=d+'/'+e.name;if(e.isDirectory())walk(f);else{const t=fs.readFileSync(f,'utf8');if(needles.some(n=>t.includes(n))){bad=true;}}}};for(const r of roots){walk(r);}process.exit(bad?0:1);"; then
  echo "ERROR: DSL residue detected in generated outputs"
  exit 1
fi

echo "SDK integration checks passed."
