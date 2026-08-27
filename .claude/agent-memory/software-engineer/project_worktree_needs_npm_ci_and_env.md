---
name: worktree_needs_npm_ci_and_env
description: fresh git worktrees under .worktrees/ start with no node_modules and no .env — both needed before typecheck/lint/test/build will run
metadata:
  type: project
---

A freshly cut worktree under `.worktrees/` (e.g. `.worktrees/agent-one`) has no
`node_modules` and no `.env` — `npm run typecheck` fails with `tsc: command not found`
until `npm ci` is run, and `npm run build` fails prerendering every Clerk-gated page
("Missing publishableKey") until an `.env` exists.

**Why:** the worktree is a separate checkout; `node_modules` and `.env` are both
gitignored and per-checkout, not shared across worktrees the way the git object store is.

**How to apply:** before running the CLAUDE.md verification commands
(`typecheck`/`lint`/`test`/`build`) in a new worktree, run `npm ci` and copy the main
repo root's `.env` (`cp /Users/fsiswanto/Documents/loonas-webapp/.env <worktree>/.env`) —
it holds `NEXT_PUBLIC_BASE_API_URL`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`,
`CLERK_SECRET_KEY`. Both are local environment setup, not source changes — neither should
be staged or committed.
