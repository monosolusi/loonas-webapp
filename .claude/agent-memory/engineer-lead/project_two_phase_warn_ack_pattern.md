---
name: two-phase-warn-ack-pattern
description: Pattern for warn→acknowledge→resubmit write flows — discriminated use-case result, arbitration in use case (not hook/repo), revalidate only on success
metadata:
  type: project
---

Two-phase warn→acknowledge→resubmit pattern for write mutations where BE returns `{data, warnings[]}` and a hard unacknowledged warning means "not posted" (first used: journal create/reverse, LNS-369).

**Where each concern lives (decided 2026-06-15):**
- **Source/repo:** pure transport. Repo returns raw `{journal: Entity, warnings: WarningEntryEntity[]}` wrapped in DataState. NO arbitration.
- **Use case:** owns arbitration. Returns `DataState<Result>` where `Result = {kind:"success"; journal; warnings} | {kind:"needs-acknowledge"; warnings}`. Rule: filter warnings where `severity==="hard" && !acknowledgedCodes.includes(code)`; if any → `needs-acknowledge` (NOT posted); else → `success`. Transport errors stay `DataFailed`. Delegate the filter to a private `arbitrate()` so `execute()` reads clean.
- **Hook:** thin, and obeys `create-hook-mutation` skill (Rules 5 + 7) like every other mutation hook. `useSWRMutationClerk("<verb>-<noun>", fetcher)` with a **hardcoded literal key** — do NOT add the mutation key to `swr-keys.ts` (that file is read-caches only). Fetcher throws only on `DataFailed`; on `DataSuccess` RETURNS the discriminated Result to the caller (do NOT throw on needs-acknowledge — the UI must see warnings). The hook does **NOT** call `revalidateSWRKey` internally.
- **Revalidation is the CALLER's job, gated on `kind:"success"`.** The caller already branches on `result.kind` (needs-acknowledge → render warning UI; success → toast/navigate), so revalidating the LIST key inside the existing success branch adds zero new knowledge to the call-site. Do not centralize it in the hook just because the result is discriminated.
- **Resubmit** = caller re-triggers with `acknowledgedWarningCodes` populated. No separate endpoint.

**Why:** prevents silent posts of unacknowledged hard warnings (the core requirement). Context7 (/vercel/swr) confirms warn/ack is business logic, NOT SWR cache state — keep it out of populateCache/optimisticData.
**Why caller-revalidates (corrected at LNS-369 arch review 2026-06-15):** my first plan (Task 12/14/15) told SWE to add `CREATE_JOURNAL`/`REVERSE_JOURNAL` to `swr-keys.ts` and revalidate inside the hook on success. Arch flagged it against `create-hook-mutation` Rules 5+7 — it would have been the ONLY self-revalidating mutation hook in the repo. The two-phase pattern's integrity lives in the use case (arbitration) and the discriminated result, NOT in hook-internal revalidation; the "spread arbitration to call-sites" worry is illusory because the caller must branch on `kind` regardless.
**How to apply:** any future write where BE returns acknowledgeable warnings (likely more accounting/tax flows). WarningEntry should be a real Model+Entity with an `isHard` guard getter the use case uses. Keep arbitration in the use case; keep the hook thin with a literal key; revalidate at the caller on success.
