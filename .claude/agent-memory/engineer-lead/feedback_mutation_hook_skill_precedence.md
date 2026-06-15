---
name: mutation-hook-skill-precedence
description: Before prescribing mutation-hook wiring in a plan, read create-hook-mutation/SKILL.md — mutation keys are hook-local string literals (never in swr-keys.ts), and cache revalidation is the caller's job, not the hook's
metadata:
  type: feedback
---

**Rule:** Before authoring any plan step that wires a mutation hook (`useSWRMutationClerk`), read `.claude/skills/create-hook-mutation/SKILL.md` and follow it. Specifically: (Rule 5) mutation keys are hook-local string literals — never add them to `swr-keys.ts`, which holds READ-cache keys only; (Rule 7) cache revalidation is the **caller's** job — the hook never calls `revalidateSWRKey` internally. More broadly: never author a plan step that contradicts an established skill convention — check the skill first.

**Why:** On 2026-06-15 (LNS-369) my Phase-3 plan (Tasks 12/14/15) told SWE to add `CREATE_JOURNAL`/`REVERSE_JOURNAL` mutation keys to `ACCOUNTING_SWR_KEYS` and to call `revalidateSWRKey(...)` inside the create/reverse hooks on `kind:"success"`. Architecture-review flagged both against `create-hook-mutation` Rules 5+7, forcing a full fix loop. SWE had faithfully implemented my (wrong) plan. The fix moved keys to hook-local literals and pushed revalidation to the caller (gated on `kind:"success"`), matching every other mutation hook in the repo.

**How to apply:** Any plan touching mutation hooks — re-read `create-hook-mutation/SKILL.md` before prescribing key placement or revalidation. Keep mutation keys out of `swr-keys.ts`; assign revalidation to the consuming provider/call-site, not the hook. The discriminated success/needs-acknowledge result still lives in the use case — moving revalidation to the caller does not weaken it.

Related: [[two-phase-warn-ack-pattern]]
