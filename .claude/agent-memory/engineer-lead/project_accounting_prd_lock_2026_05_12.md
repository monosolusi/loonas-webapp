---
name: accounting-prd-lock-2026-05-12
description: Locked PRD deltas for Plan B+ Accounting Bootstrap that bind future planning decisions in this feature
metadata:
  type: project
---

PRD for "Plan B+ Accounting Bootstrap" locked on 2026-05-12. The decisions below are binding on any subsequent planning in this feature area; do not re-litigate them without checking with PM/CPO.

**Why:** Multiple decisions in this PRD touch cross-cutting FE concerns (nav rendering, settings provider state shape, route reuse) that would otherwise look like style choices and get refactored away.

**How to apply:** Treat these as constraints when planning future accounting (or adjacent) work:

- **Idempotency-Key on manual journal POSTs:** FE sends UUIDv4 via `crypto.randomUUID()` on `POST /accounting/expenses-payment` and `POST /accounting/pph-final-settle`. BE ignores v1, accepts v2. Pattern: provider owns the key as `useState(() => crypto.randomUUID())`, regenerates only on user-initiated retry (not every render). Header passthrough via `HttpRequest`'s `FetchConfig.headers` (precedent: invoice POS sales). Don't extend `FetchConfig`.
- **Regime Pajak radio is FE-derived:** `AccountingSettingsEntity` has `is_pkp` + `is_pph_final_umkm`. The "regime" radio is a UI affordance only — map on load (derive from both fields) and on submit (split back to both fields). Never add a `regime` field to the entity.
- **`is_pkp` lives on `useGetAccountingSettings()`**, not `useGetCurrentAccount()`. PKP-aware UI (line filtering, CoA viewer gray rows) reads from the settings hook.
- **CoA viewer (D6 PKP variant) reuses `/finance/ledger`** — do not create `/accounting/chart-of-accounts`. PKP gray-row section ("Tambah Manual" CTA for 1420 and 2220) is a presentational variant of the existing list.
- **Locked-menu affordance is project-wide design** (D5 revised). Build a `core/presentations/components/locked-menu-chip.tsx` primitive + `core/presentations/utils/whatsapp-link.ts` helper. Roll out to all nav groups eventually; bootstrap PR wires only `finance-nav-group.tsx` and opens follow-up tech-debt for the rest.
- **Account `1230` ("Piutang Penyelesaian Loonas") gets a "dikelola Loonas" chip** everywhere it renders. Centralize in a small `ledger-account-name.tsx` presentational component.
- **`/finance/tax` is settlement-forward, not history-forward.** No in-page history table. "Lihat riwayat lengkap" deep-links to `/finance/journals?q=PPh Final`. No new BE endpoint requested for tax history.
- **ACCOUNTANT role (Clerk `org:accountant`) is P0 v2**, not v1. Future-proof v1 gating: route through a single helper that can accept multiple org roles without component changes. Don't hard-code `org:admin`.
- **PPN seed (1420 PPN Masukan, 2220 Utang Pajak PPN) auto-seeds v2** on `is_pkp false → true` transition. Until then, FE shows the gray "belum tersedia" rows. **1410/2210 are PPh Final accounts, untouched by this work.**
- **`update-coa-mapping` PUT must strip dynamic-role lines** (BE rejects them v1). Filter in the use case, not the repo.

Locked enums:
- `amount_role`: `primary | gross | dpp | ppn_out | ppn_in | disbursement_fee | net_amount`. PKP-only: `gross | dpp | ppn_out | ppn_in`.
- `account_role`: `received_to | paid_from` (null = static).

Locked copy lives in `src/features/accounting/presentations/constants/role-labels.ts` (UI Designer owns the Indonesian strings). Never inline.

See [[coa-account-two-shape]] for the line entity shape and [[accounting-module-audit-2026-05]] for the pre-existing scaffold to reconcile against.
