---
name: project-lns608-review-learnings
description: LNS-608 shipped stock_status advisory enum + removed dead POS stock guards — contract facts and review gotchas
metadata:
  type: project
---

LNS-608 (POS out-of-stock indication) shipped 2026-08-06 on branch `feat/lns-608-out-of-stock-indication`.

**Contract facts (verified against deployed `dev-api.loonas.id/openapi.json`):**
- `ProductForSaleVariant.stock_status` is always present, enum `IN_STOCK | OUT_OF_STOCK | NOT_TRACKED | UNKNOWN`, and **does NOT gate availability** — `OUT_OF_STOCK` does not prevent a sale (`POST /pos/sales` is never rejected for insufficient stock).
- `ProductForSaleVariant.unavailable_reason` enum is now 3 members only: `STOCK_NOT_REGISTERED | RECIPE_NOT_DEFINED | RAW_MATERIAL_NOT_REGISTERED`. `OUT_OF_STOCK` was removed from this enum — a stock shortfall no longer makes a variant unsellable.
- `is_available: true` + `stock_status: OUT_OF_STOCK` is a valid, addable combination — the out-of-stock badge is a warning chip on an enabled control, visually distinct from the error chip + disabled state for the 3 misconfig reasons.

**Review gotchas for future POS stock-touching tickets:**
- Any FE code that re-derives "out of stock" from `current_stock`/`max_makeable` sign (e.g. `current_stock <= 0`) instead of reading `stockStatus`/`isOutOfStock` is a regression — the server owns that call. The entity getter `VariantForSaleEntity.isOutOfStock` is the canonical rule; `outOfStockBadgeProps` in `availability-helpers.ts` is a display discrimination, not a re-derivation.
- The `INSUFFICIENT_STOCK` error code is KEPT in `core/resources/server-error.ts` even though the POS-sale handler branch was removed — the rationale is "POST /productions still returns it." The deployed dev-api openapi.json has zero `INSUFFICIENT_STOCK` string occurrences, so the retention claim is runtime-verified, not spec-verified. If a future ticket removes the productions endpoint or it stops returning this code, the registry entry can be deleted.
- The `priceMismatch`-clear-on-cart-edit invariant (any add/qty-change/remove clears a stale `UNIT_PRICE_MISMATCH` marker) is load-bearing — `clearPriceMismatch` in `pos-provider.tsx` must fire on all three cart mutations.

**Why:** Future POS stock tickets (e.g. low-stock notification, negative-stock UX) will need to know `stock_status` is the authoritative advisory signal and that re-deriving from balance sign is the LNS-570-shaped drift the entity rule exists to prevent.
**How to apply:** When reviewing a POS stock-touching change, grep for `current_stock <= 0` / `max_makeable <= 0` style checks and confirm they read `stockStatus`/`isOutOfStock` instead. Verify the deployed contract before trusting any brief claim about openapi-verified error codes — the dev-api spec doesn't enumerate runtime error codes in response schemas.

Related: [[project-lns570-review-learnings]] (derived-invariant drift), [[feedback-css-hidden-dual-branch-singleton]] (POS picker dual-layout sweep).