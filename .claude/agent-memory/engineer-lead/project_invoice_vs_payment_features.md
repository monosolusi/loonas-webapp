---
name: invoice-vs-payment-features-distinct-models
description: features/invoice and features/payment both have QrisPayInDetail models — they are NOT the same and must not cross-import
metadata:
  type: project
---

There are two parallel `QrisPayInDetail` model/entity stacks:
- `features/invoice/` — used by the cashier-facing POS QRIS flow (`src/app/(pos)/pos/_payment-methods/qris/`) and the authenticated invoice detail pages (`src/app/(authenticated)/invoices/incoming/[id]/qris-pay-in-detail/`).
- `features/payment/` — used by the external-app customer-facing pay-in flow (`src/app/(external-app)/external-app/invoices/[id]/pay-in-detail/`).

They share field names (`expirationTime`, `qrString`, `status`) but are independent classes with different relationship shapes and use-case wiring.

**Why:** Discovered during LNS-195 planning — a grep for `expirationTime` returns hits in both, but only the `features/invoice/` stack drives POS, and changes to one must not ripple to the other.

**How to apply:** When planning POS/cashier work, only edit `features/invoice/`. When planning external customer payment work, only edit `features/payment/`. If a change touches both, treat them as two independent edits with their own scoping — do NOT attempt to share a common model.
