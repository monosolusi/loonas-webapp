---
name: feedback-manual-journal-idempotency
description: Manual journal POST endpoints (PPh Final settle, expense payment) must guard double-submit
metadata:
  type: feedback
---

Manual journal endpoints (`POST /accounting/expenses-payment`, `POST /accounting/pph-final-settle`) post real money entries to the ledger. A double-clicked submit double-posts a tax remittance — irreversible without a reversing entry.

**Why:** Money-movement endpoints in fintech must be idempotent. The BE contract does not yet specify whether these endpoints accept an `Idempotency-Key` header, so the FE must defensively:
- Disable the submit button immediately on click until response (do NOT rely on form-state alone — use a request-in-flight ref).
- After a successful 2xx, do not allow re-submit without explicit user re-entry (close the dialog/route away).
- Surface a clear success confirmation showing the created journal `id` and ledger impact, so the user does not retry out of uncertainty.
- On network error (no response received), show a recovery flow that asks the user to check the Jurnal Umum list before retrying — never auto-retry money-movement requests.

**How to apply:** Any PRD covering manual journal POSTs must include these guards in acceptance criteria. Engineering Lead should ask BE for an `Idempotency-Key` contract before GA — track as open question.
