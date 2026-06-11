---
name: qris-pay-in-contract-2026-05-20
description: BE QrisPayIn schema and the webhook-vs-local-clock authority rule that governs FE countdown UI
type: project
---

QRIS pay-in contract as of LNS-191 (BE PR #77, merged 2026-05-19), verified against `https://dev-api.loonas.id/openapi.json` on 2026-05-20.

**Wire shape** (`components.schemas.QrisPayIn`, 6 fields):
- `id: uuid`, `type: "QRIS"`, `qr_string: string`, `expiration_time: date-time` (ISO-8601), `amount: number`, `status: enum`
- Status enum: `PENDING_CREATION | PENDING_PAYMENT | PAID | FAILED | EXPIRED` — exact casing as listed. `FAILED` is reserved (ENG-33), no POS code path reaches it today.

**Nesting**: returned inside `outgoing_invoice.pay_in_detail.detail`. The `OutgoingInvoice.pay_in_detail` schema is typed loosely as `{type: object, nullable: true}` — the spec does NOT formally `$ref` the typed pay-in schemas into the invoice envelope. Live BE returns the envelope `{id, reference_type, payment_method:{id}, detail:{...QrisPayIn fields...}}`. Don't be surprised by the spec looseness — the named `QrisPayIn` schema is the source of truth for the `detail` sub-object.

**Webhook-vs-clock authority rule** (load-bearing):
- `EXPIRED` is set by the Xendit `INACTIVE` webhook, NOT by FE local-clock comparison against `expiration_time`.
- A payment arriving after local-clock `expiration_time` but before the `INACTIVE` webhook still settles as `PAID`.
- `expiration_time` is **advisory** for FE countdown UI; `status` is the authoritative terminal signal.

**Expiry windows**:
- POS channel (`channel='pos'`): 15 minutes from `created_at`
- B2B/invoice channel (`channel='invoice'`): 24 hours from `created_at`

**POST /pos/sales idempotency**:
- `Idempotency-Key` is a **header**, not a body field. Regex `^[A-Za-z0-9_-]{8,255}$`, required, 24h TTL.
- Cached responses include 4xx/5xx — clients MUST regenerate the key to retry transient failures.
- Response: `201` returns full `OutgoingInvoice` with embedded `pay_in_detail.detail` carrying `expiration_time` immediately.

**Why:** the BE spec description for POST /pos/sales explicitly directs FE to use `pay_in_detail.expiration_time` for countdown UI but treat `status` as the terminal signal. This is the contract LNS-195 was designed against.

**How to apply:** When planning any QRIS-related FE work, the countdown is FE UX only — never derive `EXPIRED` status from a clock check. The FE may show a "expired locally" overlay once the clock crosses zero, but must continue polling `status` and accept a late `PAID` if the BE webhook says so. The 15-minute POS window vs 24-hour B2B window is enforced by BE (mirrored from Xendit's own expiry parameter), not by FE.
