---
name: project-tax-accounts-v1-lock
description: Tax accounts v1 PRD lock (2026-05-12) — Branch B confirmed; PKP regime is honest toggle (WhatsApp panel, no PATCH); FE reads accounts from tax_accounts resolver
metadata:
  type: project
---

# Tax Accounts v1 — Locked Decisions (2026-05-12)

**Why:** BE confirmed B11–B15. v1 ships minimal PKP surface; full PPN runtime deferred to v1.1.
**How to apply:** Use these decisions when speccing any tax-adjacent FE surface (settings page, CoA mapping, /finance/tax, ledger pages for 14x0/22x0).

## Locked

- **PKP regime UX:** Selecting "PKP" in regime radio opens WhatsApp activation panel. No PATCH fires. `is_pkp` is never written from FE in v1. Sales activates out-of-product. Rationale: performative toggles that don't propagate downstream behavior break trust on a fintech regime flag.
- **Copy contracts use resolver templates:** FE renders `{name}` and `{code}` from `tax_accounts.ppn_input | ppn_payable | pph_final_prepaid | pph_final_payable`. No hardcoded numeric codes in copy.
- **Null resolver handling:** When `tax_accounts.ppn_input` or `.ppn_payable` is null (non-PKP tenant), CoA mapping tooltip is suppressed and slot is disabled with helper "Tersedia setelah aktivasi PKP." No generic fallback naming a nonexistent account.
- **PPh Final balance card** (`/finance/tax`): sourced from `tax_accounts.pph_final_payable`. Hidden if null.
- **"PPN — Segera Hadir" tile:** generic copy, no code references in v1.

## v1.1 forward-design rules

- Mapping editor's `amount_role` dropdown must be extensible — design for new enum values (`dpp`, `ppn_in`, `ppn_out`) without component rework.
- Do NOT render placeholders for `pkp_effective_date` / `nppkp_number` in v1 settings page.
- POS gross-to-DPP stripping and PT-PKP/PPh Badan: fully deferred, no v1 surface.

## Conditional / open

- B12 renumbering (1410/1420/2210/2220) timing depends on tenant-posting inventory (Loonas data-ops, not FE).
- B15 field-level resolver shape — EL feasibility memo pending.

## BE-shaped questions outstanding

- Is `GET /accounting/settings` existing or new alongside `tax_accounts`?
- Does `tax_accounts` appear on PATCH response too, or GET only?
- Should stale-client `PATCH is_pkp=true` be rejected or accepted-and-no-op?

Related: [[project-coa-mapping-shape]], [[project-pkp-ppn-codes]], [[project-accounting-domain]]
