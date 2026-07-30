---
name: pos-offline-capability
description: POS Offline project (LNS-584..598, filed 2026-07-30) — hard verified constraints: POS sales REJECT insufficient stock (no permissive flag anywhere), 24h idempotency TTL ceiling, zero delta-sync in the API, Clerk has no web offline session
metadata:
  type: project
---

POS Offline Capability project created 2026-07-30 (`0b9c0f8b-d766-44e8-a848-268bb0066f0e`) with LNS-584..598 and a trade-off-analysis project document. Recommendation: cache-first full-snapshot catalog reads + a durable IndexedDB sale outbox replayed serially on reconnect; CASH-only offline, QRIS structurally online-only.

**Why:** the user (FE lead) asked for offline POS with sync-on-reconnect. Five verified constraints shape it, and each will govern **any** future POS, inventory, offline, caching, or retry work. None is visible from the FE code alone and each took real digging.

1. **`POST /pos/sales` REJECTS insufficient stock — `400 INSUFFICIENT_STOCK`, nothing recorded.** Documented in both the 400 description and the endpoint side-effects (*"stock decrement failures reject the entire request — no partial commit"*). Searched the full spec for `negative|backorder|oversell|allow_negative|skip_stock|ignore_stock`: **zero hits — no permissive flag, setting, or header exists.** **Product decision 2026-07-30 (user, verbatim): "should allow negative stock, business must continue without administration overhead"** — negative stock is a legitimate state and no routine sale may become a human task. That decision is therefore **not implementable FE-side**; filed as blocking BE dep LNS-598 on the write path (LNS-591/592/593). Two axes: `batch` bounded by `current_stock`, `on_demand` bounded by `max_makeable` (raw materials) — a made-to-order F&B merchant is blocked by raw materials, so a finished-goods-only fix is insufficient. **Three FE gates exist; the deepest is `addItem`'s `!variant.isAvailable` refusal — an out-of-stock variant cannot even enter the cart.** `unavailable_reason` is a 4-member enum (`STOCK_NOT_REGISTERED | RAW_MATERIAL_NOT_REGISTERED | RECIPE_NOT_DEFINED | OUT_OF_STOCK`) that usefully separates the now-permitted case (`OUT_OF_STOCK`) from three genuine config gaps that should keep blocking.
2. **`POST /pos/sales` idempotency has a 24h TTL and NO dedup past it.** Spec: *"not enforced beyond the 24h Idempotency-Key window; server-side request-id deduplication is tracked for a future release."* Any client write queue must refuse to auto-replay entries older than 24h and escalate — automatic money movement under a broken dedup guarantee is the forbidden move. BE request: LNS-597.
3. **ZERO delta-sync capability in the entire API.** All 124 paths parsed; every declared parameter checked against `since|cursor|etag|updated|delta|sync|version|modified|after|from` — only `api-version` matched. Full-snapshot refresh is the only option. BE request: LNS-596. **Re-verify before assuming still true.**
4. **Clerk has no offline session support on web.** Token TTL 1 minute; `ClerkOfflineError` absent from the installed `@clerk/nextjs` 6.38.2, so offline is ambiguous with signed-out. `ProtectedPage` can blank the POS and can `router.replace("/sign-in")` mid-shift, destroying cart state (Bug LNS-588). `navigator.onLine` alone is insufficient — it reports true on captive portals and dead 4G.
5. **The FE already has the right idempotency primitive.** `shouldRotateIdempotencyKey` (`features/invoice/presentations/helpers/`) correctly encodes rotate-on-4xx / never-on-5xx-or-network. Make it *durable*; never reimplement it — a divergent second copy is how a double-charge happens.

**How to apply:** re-check 1–4 against the live spec before scoping anything in this area. Durable design rules worth reusing:

- **Never send `unit_price` on a POS sale.** The server charges its own resolved price; sending ours turns a silent delta into a full 422 rejection of an already-paid sale.
- **Distinguish a price-staleness gate from a stock gate.** Staleness is money correctness and stays; stock is inventory administration and goes. "Remove the gate that blocks offline sales" is an easy over-generalisation that would delete the wrong one.
- **Classify replay outcomes into THREE buckets, not two:** retryable · terminal-money-safety (owner's reconciliation queue) · must-not-occur contract violation (engineering diagnostic surface, never a merchant chore). Needed because excluding a rejection from the owner's queue still leaves the question of where it goes if it arrives anyway, and cash must never be silently dropped.
- **The acceptance test for "no administration overhead" is "the reconciliation queue is empty in normal operation."** A well-designed queue that fills up daily has failed the requirement regardless of its UI.

See [[linear-filing-in-this-repo]], [[manual-journal-idempotency-standard]], [[unofest]].
