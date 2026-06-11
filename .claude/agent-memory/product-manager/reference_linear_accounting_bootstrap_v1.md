---
name: reference-linear-accounting-bootstrap-v1
description: Linear issue index for the Accounting Bootstrap v1 (Plan B+) rollout — tracker, 4 phases, 6 v1.1 tech-debt follow-ups
metadata:
  type: reference
---

Linear project: **Accounting Bootstrap v1 (Plan B+)** — https://linear.app/loonas/project/accounting-bootstrap-v1-plan-b-30ea8f095687

**Why:** Created 2026-05-12 post-LNS-70 lock. Use to cross-reference future spec work; check status before re-speccing.

## Issues

- **LNS-76** — Tracker (epic). Coordinates the 4 phases. High.
- **LNS-77** — P1 Settings IA + tax_accounts resolver. Urgent. Blocks LNS-78 + LNS-79.
- **LNS-78** — P3 CoA mappings redesign (PKP-aware, dynamic account_role). High. Blocked by LNS-77.
- **LNS-79** — P4 /finance/tax page + manual journal POSTs + MoneyMovementConfirmDialog. High. Blocked by LNS-77.
- **LNS-80** — P6 ACCOUNTANT design constraints (doc-only, no v1 code). Low.

## v1.1 tech-debt follow-ups (Medium priority)

- **LNS-81** — Real PKP runtime (auto-seed 1420/2220, 3-field profile, POS gross-to-DPP)
- **LNS-82** — Idempotency-Key activation BE side (B1 v2)
- **LNS-83** — Partial PUT for update-coa-mapping with dynamic-line acceptance (B3 v2)
- **LNS-84** — /accounting/tax-periods integration (B10 v2)
- **LNS-85** — reference_type journal filter (B4 v2)
- **LNS-86** — ACCOUNTANT role wire-up (B5 v2)

## How to apply

- When new accounting FE work surfaces, check LNS-76 for context first.
- When merchant asks about PKP / PPN / PPh Final UX, point to LNS-77 / LNS-79 ACs.
- For CoA mapping changes, defer to LNS-78 ACs (especially line state matrix).
- v1.1 work waiting on BE — verify BE readiness before scheduling LNS-81 through LNS-86.

Related: [[project-tax-accounts-v1-lock]], [[project-pkp-ppn-codes]], [[project-coa-mapping-shape]], [[project-account-1230-badge-surfaces]], [[project-accounting-domain]], [[feedback-manual-journal-idempotency]]
