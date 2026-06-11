---
name: reference-payment-features-disambig
description: Disambiguates the three "payment" surfaces in the codebase so they don't get conflated
metadata:
  type: reference
---

There are three distinct "payment" surfaces in Loonas:

1. **`src/features/payment/`** — pay-in / incoming-invoice flow. A customer pays a Loonas-issued invoice. NOT for POS, NOT for accounting expense payments.
2. **`src/app/(pos)/pos/_payment-methods/`** — POS cashier payment-method plugin pattern (cash, QRIS, EDC, e-wallet, voucher). See `PLUGIN_PATTERN.md` before adding/modifying. Used by the cashier wizard at the point of sale.
3. **`POST /accounting/expenses-payment`** (Plan B+) — operator records an operational expense paid from a bank/cash account. This posts a manual journal to the ledger; it is NOT a customer-facing payment and NOT a POS transaction.

**Why:** The word "payment" is overloaded. When a user says "add a payment", check which surface they mean.

**How to apply:** When scoping a feature mentioning "payment", first ask: is this money flowing in (pay-in), through (POS cashier), or out (operational expense)? Pick the correct surface; do not extend the wrong feature module.
