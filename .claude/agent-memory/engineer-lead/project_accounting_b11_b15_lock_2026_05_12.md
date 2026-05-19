---
name: accounting-b11-b15-lock-2026-05-12
description: BE-locked outcomes B11–B15 for Plan B+ Accounting v1; Branch B confirmed, tax-account resolver shape locked
metadata:
  type: project
---

BE confirmed B11–B15 on 2026-05-12. These supersede the still-open items in [[accounting-be-reply-2026-05-12]] and tighten [[accounting-prd-lock-2026-05-12]].

**Why:** v1 contract surface is now closed; future FE plans in this feature must align with these locks. Overrides the PPN auto-seed Branch A/B fork in the prior reply memo.

**How to apply:**

- **B11 — Branch B locked for v1.** PKP toggle is profile-only metadata. No auto-seed. The regime-radio "PKP" option opens `PkvWhatsAppPanel` and does NOT PATCH `is_pkp=true` (EL recommendation: keep `is_pkp` false until v1.1 proper enablement; flagged for PM confirmation but no blocker). Drop `PkvCoaBanner` entirely. Drop "missing accounts" rendering. Branch A code paths are not built. v1.1 will ship: auto-seed, 3-field PKP profile (`is_pkp` + `pkp_effective_date` + `nppkp_number`), `amount_role` additions `dpp`/`ppn_in`/`ppn_out` in mapping data, POS gross-to-DPP stripping, PT-PKP + PPh Badan support.

- **B12 — Tax account code flip confirmed** (was already in BE reply): 1410 PPN Masukan, 1420 PPh Final Dibayar Dimuka, 2210 Utang Pajak PPN, 2220 PPh Final Terutang. BE migrates tenant data server-side; FE remains data-driven.

- **B13 — `POST /accounting/pph-final-settle` contract unchanged.** No FE call-site changes.

- **B14 — Auto-seed response shape is v1.1 work.** v1.1 direction: PATCH-synchronous, response payload `accounts_seeded: [{id, code, name}, ...]`. Final contract returns in v1.1 turn.

- **B15 — Tax-purpose resolver locked.** `GET /accounting/settings` returns `tax_accounts: { ppn_input, ppn_payable, pph_final_prepaid, pph_final_payable }`, each `{ id, code, name } | null`. `null` means no backing seeded account (= "PKP not enabled" in v1). Consumer (FE) uses `settings.taxAccounts.*.id` for balance queries and `.code`/`.name` for inline rendering. No hardcoded `1410`/`1420`/`2210`/`2220` in FE.

**Open BE-relay items (sent 2026-05-12 with the feasibility memo):**
1. Include `tax_accounts` on PATCH response too (not just GET).
2. Commit to additive-only evolution of `tax_accounts` keys.
3. Confirm caching horizon (session-stable vs out-of-band mutable).
4. v1.1 PKP-pending vs PKP-off discriminator decision.

**FE design implications captured for planning:**
- `AccountingSettingsEntity` gains `taxAccounts: TaxAccountsMap` + `get hasPpnEnabled(): boolean` (true when `taxAccounts.ppnInput !== null`).
- No separate `useTaxAccounts` hook — read from `useGetAccountingSettings()` directly.
- `amount_role` enum: FE includes full 7 values now (`primary | gross | dpp | ppn_out | ppn_in | disbursement_fee | net_amount`) even though v1 mapping data only uses 3.
- `pkp_effective_date` + `nppkp_number` NOT in v1 entity — added in v1.1.
- Account 1230 stays hardcoded (platform-managed, not resolver-eligible). Centralize as `LOONAS_SETTLEMENT_RECEIVABLE_CODE` constant.
- Phasing: 4 phases (P1 settings + resolver, P3 CoA + mappings, P4 `/finance/tax`, P6 ACCOUNTANT role gating helper). P2 and P5 folded.

See [[accounting-prd-lock-2026-05-12]], [[accounting-be-reply-2026-05-12]], [[coa-account-two-shape]].
