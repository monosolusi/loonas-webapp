---
name: mutation-hook-skill-precedence
description: Before prescribing mutation-hook wiring in a plan, read create-hook-mutation/SKILL.md — mutation keys are hook-local string literals (never in swr-keys.ts), and cache revalidation is the caller's job, not the hook's
metadata:
  type: feedback
---

**Rule:** Before authoring any plan step that wires a mutation hook (`useSWRMutationClerk`), read `.claude/skills/create-hook-mutation/SKILL.md` and follow it. Specifically: (Rule 5) mutation keys are hook-local string literals — never add them to `swr-keys.ts`, which holds READ-cache keys only; (Rule 7) cache revalidation is the **caller's** job — the hook never calls `revalidateSWRKey` internally. More broadly: never author a plan step that contradicts an established skill convention — check the skill first.

**Why:** On 2026-06-15 (LNS-369) my Phase-3 plan (Tasks 12/14/15) told SWE to add `CREATE_JOURNAL`/`REVERSE_JOURNAL` mutation keys to `ACCOUNTING_SWR_KEYS` and to call `revalidateSWRKey(...)` inside the create/reverse hooks on `kind:"success"`. Architecture-review flagged both against `create-hook-mutation` Rules 5+7, forcing a full fix loop. SWE had faithfully implemented my (wrong) plan. The fix moved keys to hook-local literals and pushed revalidation to the caller (gated on `kind:"success"`), matching every other mutation hook in the repo.

**How to apply:** Any plan touching mutation hooks — re-read `create-hook-mutation/SKILL.md` before prescribing key placement or revalidation. Keep mutation keys out of `swr-keys.ts`; assign revalidation to the consuming provider/call-site, not the hook. The discriminated success/needs-acknowledge result still lives in the use case — moving revalidation to the caller does not weaken it.

**`revalidateSWRKey` matches array keys by `key[0]`:** `revalidateSWRKey(...prefixes)` does `mutate(key => Array.isArray(key) && prefixes.includes(key[0]))`, so passing the leading constant (e.g. `revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_JOURNALS)`) correctly invalidates an array key like `[LIST_JOURNALS, { clerk, params }]` across all its param variants. Do NOT hand-roll a predicate `mutate` for this, and don't caution against the helper without reading its impl — verified LNS-371.

**Correction — the "Why" above overstates the fix (verified 2026-06-26, LNS-406 review):** Only the *revalidation* half of the LNS-369 fix is reflected in live code. The *key* half regressed (or never landed): `ACCOUNTING_SWR_KEYS` STILL defines `CREATE_JOURNAL`/`REVERSE_JOURNAL` (`swr-keys.ts:21-22`) and `use-create-journal.ts:45` / `use-reverse-journal.ts:52` STILL pass `ACCOUNTING_SWR_KEYS.CREATE_JOURNAL` / `.REVERSE_JOURNAL` — i.e. two live Rule-5 violations remain. Lesson: an agent-memory claim that something is "already fixed" is not authority — grep the live files before relying on it (or before telling a teammate the debt is gone). These two journal keys are open residual debt for a separate ticket; they were deliberately left out of LNS-406 scope (whose own close/reopen-period hooks already use hook-local literals and are Rule-5 compliant).

Related: [[two-phase-warn-ack-pattern]]
