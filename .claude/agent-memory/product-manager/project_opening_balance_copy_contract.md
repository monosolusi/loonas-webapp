---
name: opening-balance-copy-contract
description: LNS-344 Opening Balance Wizard FE copy — mid-year Laba Rugi explainer + frozen 422 NORMAL_BALANCE_HINT deficit-block contract
metadata:
  type: project
---

LNS-344 (be-requested-fe, Frontend; In Progress 2026-06-19) is a copy/contract handoff (FE-only, no BE change) for the Opening Balance Wizard. BE shipped in LNS-106 (Done, PR #228). Two BI copy artifacts:

- **Item A — mid-year Laba Rugi explainer:** mid-year migrant's prior+YTD profit lands as one equity opening line in `3200 Saldo Laba Ditahan Periode Sebelumnya`, so first-FY Laba Rugi shows only the post-cutover stub. Copy reassures: scope is since-cutover, prior profit safe in equity, not an error. Informational (not a warning).
- **Item B — 422 deficit block:** opening-balance normal-balance check returns hard **HTTP 422, code `NORMAL_BALANCE_HINT`, detail `{ lines: [{ account_id, entered_side, corrected_side }] }`**. No override in v1 (override is separate track LNS-339). Loss-making migrant with net accumulated deficit = equity line legitimately on **debit** side → hits this 422 and is blocked. FE must render an actionable no-blame BI message, never the raw 422. Deficit branch = equity account with `entered_side=debit` → "not supported this version + concrete next step (contact support)".

**Why:** correct-but-confusing accounting outcomes that read as bugs/dead-ends to a non-technical UMKM owner; CPO pre-greenlit both via LNS-106 Condition 3; inside non-PKP UMKM window (ends 2026-08-10).

**Phase-2 resolutions (2026-06-19, FINAL PRD):**
- **NO Opening Balance Wizard FE surface exists** (grep-verified: no `opening-balance` route under `src/app`, no submit form). So Item B (the 422 block) has no host to render in yet. Decision: author copy + reusable block components + the resolver + the `HttpRequest` fix NOW; defer live wizard wiring + e2e to **LNS-379** (the wizard FE surface, which LNS-344 blocks). Item A ships fully now (its host, the Laba Rugi viewer from LNS-374, exists).
- **Deficit detection IS client-derivable → NO `fe-requested-be` filed.** 422 payload has no `account_type`, but FE resolves `account_id → type` via `useListLedgerAccounts` (`GET /accounting/accounts`); `AccountType.EQUITY = "equity"` confirmed at `src/features/accounting/domain/enums/account-type.ts:4`. Deficit branch ⇔ offending line account `type==="equity"` AND `entered_side==="debit"`.
- **Real prerequisite is FE-internal:** `HttpRequest` (`src/core/helpers/http-request.ts` ~67-73) DROPS `data.details`, so FE never sees the 422 `lines[]`. `ServerError` already has a `details` slot. Widen = Task 1 of Item B (host-independent, unblocks all 422-detail consumers).
- **Item A detection = `3200`-probe** (chosen over date-heuristic / show-unconditionally): probe `GET /accounting/opening-balance` for a line with `account_code === "3200"`. NO BE `is_migration_stub` flag exists (UI assumed one; EL disproved) — Item A is NOT BE-blocked.
- **Copy voice = "tim Loonas"** (third-person, consistent with `PkvWhatsAppPanel`), not first-person "kami".
- **Mixed-offender precedence:** generic/fixable wrong-side leads; deficit dead-end only when no fixable line remains (owner may complete by fixing a typo).
- 422 `details` is **prose-only in the spec (not schema-validated)** → fragile; EL confirms `entered_side`/`corrected_side` domain vs raw spec. Two BE-hardening asks (typed 422 schema; 3200 seed guarantee) relayed to orchestrator as NON-blocking.

**How to apply:**
- Re-confirm 422 field names against RAW OpenAPI via EL (WebFetch summarizer did NOT surface `/accounting/opening-balance`; treat as truncation per [[neraca-contract]]/LNS-373, not absence). Related BE-clarification: **LNS-368**.
- Out of scope: placement beyond UI spec, render mechanics, telemetry, the override feature (LNS-339), building the wizard surface (LNS-379).
