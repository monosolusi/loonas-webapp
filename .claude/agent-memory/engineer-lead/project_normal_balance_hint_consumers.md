---
name: normal-balance-hint-consumers
description: The normal-balance-hint resolver/parser/blocks are consumed ONLY by the LNS-379 opening-balance wizard — NOT by LNS-371 manual-journal; no cross-ticket regression surface
metadata:
  type: project
---

As of 2026-06-25 (LNS-379 Phase-6 triage), the four "shared 422" accounting bits are each imported by **exactly one** consumer — the LNS-379 opening-balance wizard provider/balances-step:
- `parseNormalBalanceHintLines` (data/models/normal-balance-hint.ts)
- `resolveNormalBalanceOutcome` + `NormalBalanceOutcome` (presentations/helpers/normal-balance-hint-resolver.ts)
- `NormalBalanceHintBlock`, `AccumulatedDeficitBlock` (presentations/components/)

**Why it matters:** LNS-371's manual-journal flow (`app/(authenticated)/finance/journals/**`, `journal-line-editor/`) does NOT consume any of them — its 422 path is the separate warn→ack `WarningEntryEntity` arbitration in `create-journal.usecases.ts` (different mechanism entirely). So edits to the resolver/parser/blocks/copy have **zero LNS-371 regression surface**, despite these being LNS-344-authored "shared" components. A reviewer assuming "shared with manual-journal" is wrong — grep before accepting that premise.

**How to apply:** when triaging a change to these four files, the only consumer to regression-check is the opening-balance wizard. The AC-6 resolver "deficit-only-when-nothing-fixable" fix is safe (no type-sig change to `NormalBalanceOutcome`, provider consumer untouched). The 422 NORMAL_BALANCE_HINT response CAN carry a mixed line set (prose: "one or more lines" in a `lines[]` array; deficit is the FE's *interpretation* of an equity-on-debit line, not a separate BE code), so the mixed-offender AC-6 scenario is reachable, not moot. See [[project_opening_balance_post_contract_2026_06_25]].
