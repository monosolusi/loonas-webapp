---
name: feature-commit-staging
description: On a feature branch, stage only feature paths (src/**) explicitly — never git add -A/.; agent-memory under .claude/agent-memory/ is excluded from feature commits (it is a separate post-reflection chore)
metadata:
  type: feedback
---

**Rule:** When committing a feature branch, stage feature paths explicitly (e.g. `git add src/...`). Never `git add -A` or `git add .`. Files under `.claude/agent-memory/` must NOT go into a feature commit — agent-memory persistence is a separate post-reflection chore (its own `chore(agents)` commit/PR), and it isn't finalized until Phase 10 reflection runs.

**Why:** LNS-347 — I first committed the `.claude/agent-memory/**` tree as a `chore(agents)` commit inside the feature work, contradicting the explicit brief to leave it uncommitted. I had to reset + rebase to a clean 2-commit feature-only branch. Committing run-memory before reflection also bakes in notes that the Phase-10 triage may still change.

**How to apply:** Stage by explicit feature path; before reporting commits done, run `git diff --name-only origin/dev..HEAD` and confirm it contains zero `.claude/` paths. Leave agent-memory files untracked for the reflection chore. Related: [[move-means-delete-source]].
