---
name: project-accounting-domain
description: Loonas accounting module — what surfaces exist, what they cover, what the BE Plan B+ release introduced
metadata:
  type: project
---

Loonas accounting module spans these surfaces:

**Existing on `features/accounting-bootstrap` branch:**
- `/finance/ledger` + `/finance/ledger/[accountId]` — Buku Besar (ledger account list + ledger entries detail)
- `/finance/journals` — Jurnal Umum (journal list, read-only)
- `/finance/fixed-costs` — Biaya Tetap (operational fixed-cost tracking, separate from accounting CoA)
- `/settings/coa-mappings` — multi-line CoA mapping CRUD with T-account UI

**Net-new from Plan B+ release (BE shipped, FE not yet built):**
- Accounting Settings (legal form, PKP, NPWP/NPPKP, PPh Final UMKM, sektor KLBI)
- Expense Payment manual journal endpoint
- PPh Final Settle manual journal endpoint
- 26-account default CoA seeded on tenant creation
- Entity-type catalogue (18 types, categorized, with auto_outbox vs manual_endpoint patterns)

**Gating:** all accounting features gated by `account.hasFeature("accounting")`. Currently INTERNAL-role-only tenants.

**Why:** Loonas is migrating from a non-accounting POS model to a real double-entry ledger. Plan B+ is the bootstrap that lets accounting flow data automatically (auto_outbox) while reserving operator-initiated journals for tax/expense.

**How to apply:** Any new accounting work should respect the feature gate. New manual-journal flows should be discoverable but not surfaced to non-accountant users. Indonesian copy is required (this is the only language Loonas tenants read).
