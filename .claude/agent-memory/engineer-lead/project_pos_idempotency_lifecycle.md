---
name: pos-idempotency-key-lifecycle
description: How the POS idempotency key for POST /pos/sales is minted, regenerated, and where its lifecycle lives
metadata:
  type: project
---

The POS idempotency key for `POST /pos/sales` is owned by `PosProvider` (`src/app/(pos)/pos/_providers/pos-provider.tsx`).

- Initial mint: lazy `useState(() => crypto.randomUUID())`.
- Auto-regeneration: a `useEffect` keyed on `[items, selectedPaymentGatewayId]` mints a fresh UUID whenever the cart or method changes — this guarantees the next checkout attempt won't be served the cached BE response from a prior attempt.
- BE behaviour: BE caches **all** responses (including 4xx/5xx) under the Idempotency-Key. A retry with the same key returns the cached failure — so genuine retries require a fresh key.
- `CONFLICT` / `IDEMPOTENCY_KEY_IN_PROGRESS` is the only code that may auto-retry with the same key (one-shot, 1s delay).

**Why:** Recorded after LNS-195 added an explicit `regenerateIdempotencyKey()` action for the "Buat QR baru" expired-recovery flow.

**How to apply:** When planning any feature that re-triggers `POST /pos/sales` for the same cart (recovery, retry, regenerate), expose a regenerate action on `PosProvider` and call it before re-triggering. Never reuse a key after a 4xx that you don't want to inherit. Keep the lifecycle inside `PosProvider` — don't sprinkle `setIdempotencyKey` callers across components.
