---
name: accounting-be-reply-2026-05-12
description: Post-PRD-lock BE reply that flips account codes, drops create-ledger-account v1, and forks PPN auto-seed into Branch A/B
metadata:
  type: project
---

BE reply on 2026-05-12 to FE asks B9 + B10. Material changes to the Plan B+ Accounting Bootstrap plan. Overrides parts of [[accounting-prd-lock-2026-05-12]].

**Why:** These deltas land after the PRD lock and bind v1 scope; future planning must respect them.

**How to apply:**

- **Account code flip (overrides PRD line "1410/2210 are PPh Final"):** PPN now lives at **1410 (PPN Masukan)** and **2210 (Utang Pajak PPN)**. PPh Final relocates to **1420 (PPh Final Dibayar Dimuka)** and **2220 (PPh Final Terutang)**. BE migrates tenant data server-side (confirm before P3 ships). FE codebase has zero hardcoded references to these codes as of 2026-05-12 — feature is data-driven, migration is transparent.

- **No manual-create endpoint v1:** BE will not ship `POST /accounting/ledger-accounts`. Drop create-ledger-account use case, repo method, source method, hook, and dialog from any plan. CoA stays read-only v1. The "Tambah Manual" CTA from the PRD (PKP gray-row section) is dropped or rephrased as a locked-menu chip.

- **PPN auto-seed forks into two branches (BE will pick one):**
  - **Branch A:** BE auto-seeds 1410/2210 on `is_pkp false → true`. PKP becomes a real in-product state. FE: regime radio submits `is_pkp=true`, revalidates `LIST_LEDGER_ACCOUNTS`, surfaces toast.
  - **Branch B:** No auto-seed. PKP is metadata-only with no FE consequence. FE: regime radio "PKP" option opens `PkvWhatsAppPanel` (locked-CTA pattern), never PATCHes `is_pkp=true`.
  - Fork on feature flag `accounting.ppn_auto_seed` via `account.hasFeature(...)` per project convention.

- **tax-periods is v2 confirmed.** v1 hardcoded rolling 12-mo via Luxon. v2 contract preview: `/accounting/tax-periods` with `period_type | period_start | period_end | status`, server-auto-generated.

- **Tax account resolver is a pending BE-ask:** FE prefers BE to return a `tax_accounts` lookup `{ ppn_input, ppn_payable, pph_final_prepaid, pph_final_payable }` → ledger account IDs so `/finance/tax` balance cards never hardcode codes. If declined, fall back to a frozen name-match table in `src/features/accounting/domain/constants/tax-account-names.ts`.

Phasing impact: P2 (CoA viewer) collapses into P1 (no create stack to build). P5 (money-movement confirm dialog) folds into P4. Net: 4 phases instead of 6.

See [[coa-account-two-shape]], [[accounting-prd-lock-2026-05-12]], [[tax-periods-no-be-resource]].
