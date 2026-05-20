---
name: qa-patterns
description: Recurring QA findings, build quirks, and verification gotchas specific to this codebase
metadata:
  type: project
---

## Known build warnings (not failures)

- `next lint` emits deprecation warning: "`next lint` is deprecated and will be removed in Next.js 16". Exit code is still 0 — treat as informational, not a failure.
- `layout.tsx:29` — ESLint warning `@next/next/no-page-custom-font`. Persistent, pre-existing, non-blocking.
- Node.js `[DEP0205]` deprecation warning during build (`module.register()` deprecated). Exit 0, non-blocking.

## Infrastructure / CI tickets

- For pure CI/infra tickets (no UI surface), skip dev server boot and Playwright smoke entirely. The three mandatory commands + YAML inspection + diff scope check are the full QA scope.
- `.github/workflows/ci.yml` cannot be run locally — validate YAML syntax, action pin versions, triggers, step names, concurrency block, env vars, and cache key shape via static inspection only.
- Python `yaml` module may not be available in the shell environment. Fall back to reading the file directly with the Read tool and inspecting manually.

## Build performance

- Production build (`npm run build`) completes in approximately 7-8 seconds compile + page generation for ~65 routes. Does not hang. No need for extended timeout beyond 5 minutes.

## package.json

- `node -e "JSON.parse(require('fs').readFileSync('package.json'))"` is a reliable JSON validity gate. Exit 0 = valid.
