---
name: shared-worktree-git-add-index-race
description: git add <specific files> + git commit can still sweep in a concurrent agent's already-staged changes in a shared worktree
metadata:
  type: feedback
---

`git commit` commits the WHOLE index, not just the files named in your most recent `git add`. When
multiple agents share one worktree/branch (parallel phase agents each with a strict file-boundary
brief, e.g. LNS `fix/kyc-pending-reentry` phase 2A/2B/2C), a concurrent agent can `git add` its own
in-progress file between your `git add` and your `git commit` — its change lands in your commit even
though you never named that file. Observed: naming exactly 3 Task-1 files still produced a commit
that also included another agent's pure-rename (0 content diff) of an onboarding file.

**Why:** discovered mid-task on `fix/kyc-pending-reentry` phase 2B — the fix landed harmlessly (0-diff
rename, no functional risk) but it muddies commit attribution and could bundle an unfinished change
into your commit message in a worse case.

**How to apply:** in any multi-agent/shared-worktree session, run `git diff --cached --name-status`
(or `--name-only`) immediately after `git add` and immediately before `git commit`, for every commit,
not just the first. Confirm the staged list is EXACTLY your intended files. If something extra
appears, prefer `git restore --staged <path>` to unstage it (safe, does not touch working-tree
content, does not affect the other agent) rather than committing it or trying to reverse it after
the fact — reversing an already-committed sweep-in risks breaking a concurrent agent's in-flight
edits elsewhere (e.g. import paths already updated to reference a renamed file) that you cannot see
from your own scope. If you only catch it after commit, don't attempt a destructive
reset/revert — flag it in your completion report instead and let the orchestrator decide, per
[[feedback_no_auto_commit]]-style "stay in your lane" discipline.

**Detecting mid-task HEAD drift:** if a `git mv`/edit lands on a path that already has byte-identical
content to what you were about to write (git shows nothing staged for it after `git add`), don't
assume you made a mistake — run `git log --oneline -5` and compare against the HEAD you started
from (in your task briefing or an early `git status`/`git log` call). If HEAD has moved, `git log
--oneline --all -- <path>` plus `git merge-base --is-ancestor <suspect-commit> HEAD` confirms whether
a concurrent agent already completed the same sub-task on the shared branch. Observed again on
`fix/kyc-pending-reentry`: phase 2A independently arrived at the identical move (same source path,
same destination path, byte-identical content) that phase-2's sibling agent had just committed —
both briefs called for relocating the same shared component. Re-running `git mv` was a safe no-op;
no rework was needed, just re-verifying typecheck/lint/test against the new HEAD before committing.
