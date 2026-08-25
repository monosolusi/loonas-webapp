---
name: lns691-revalidate-class
description: LNS-691 is the class home for revalidateSWRKey defects (false-failure + content blanking) — fold new instances in, don't file per-page
metadata:
  type: project
---

**LNS-691** (filed 2026-08-25, High, `Frontend`+`Bug`+`safety`, no project) owns the whole `revalidateSWRKey` defect class app-wide. Two symptoms from one cause: (A) an awaited revalidation inside the mutation's `try` lets a refetch rejection be caught by the mutation's `catch`, reporting a committed write as failed **and rotating the idempotency key** — turning the user's retry into a duplicate ledger write; (B) the same failed refetch sets `error` on the reading hook's cache entry, and ~48 of 85 house hooks check `error` before `data`, so a loaded surface swaps to its full error view.

**Why:** LNS-676 fixed only symptom A, only on `overhead-accounts-provider.tsx`. An intake grep found ~39 call sites with the unsafe shape and 9 confirmed blanking surfaces — including money paths (period close/reopen, journal reversal, PPh Final settlement, stock adjustment) and `tax-posture`, whose non-403 path falls through to a **permanent skeleton**.

**How to apply:** if a future ticket surfaces another instance, fold it into LNS-691 rather than filing a per-page ticket — the ACs are grep-verifiable class invariants, and the enumeration in the body is explicitly a floor. The correct hook shape already ships in-repo from LNS-640 (`use-list-cost-valuation-gaps.ts`, `use-get-general-ledger-report.ts`): `keepPreviousData` + gate the error state on `error && !data` + `isLoadingPage: isValidating`. `keepPreviousData` alone does not fix it. Cite that precedent instead of re-deriving. See [[linear-filing-in-this-repo]].
