---
name: release-branch-stacking
description: Epic FE work can stack on a local-only `release/*` integration branch instead of targeting `dev` directly — confirm the base and push it before opening the PR
metadata:
  type: project
---

`dev` is the default PR trunk, but a multi-ticket epic may stack its FE tickets on a `release/*`
integration branch first, which is then promoted to `dev` as one PR once every sibling has landed.
Confirmed 2026-07-28 on the tiered-pricing epic: LNS-489 (PR #203) targeted `release/tiered-pricing`,
not `dev`, with LNS-517 still to land on the same base before promotion. Re-confirmed 2026-08-11 on
`release/negative-stock` (PR #215) — and that one carried **no Linear ticket at all** (user explicitly
declined to file one), so a `release/*` base does not imply an epic-ticket chain: a standalone
user-reported defect can land on the same integration branch with no `Closes LNS-xxx` in the body.
That base already existed on the remote, so the push-the-base step below was a no-op — check, don't assume
either way.

**Why:** batching an epic's FE tickets behind one integration branch keeps `dev` free of a
half-finished feature surface, so the epic reaches `dev` as one reviewable, coherent unit.

**How to apply:** at PR-open, never assume `dev` — take the base from the orchestrator's brief.
When the base is a `release/*` branch, check `git ls-remote --heads origin <base>` first: these
branches are often **local-only** at that point, and `gh pr create` fails if the base does not exist
on the remote. Push the base (`git push -u origin <base>`) BEFORE pushing the head and opening the
PR. Verify scope with `git diff origin/<base>...HEAD` per [[rule-20-remote-base-scope]], since a
just-created remote base makes the local/remote distinction easy to blur.
