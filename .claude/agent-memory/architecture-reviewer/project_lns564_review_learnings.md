---
name: lns564-review-learnings
description: LNS-564 tiered/grosir pricing FE review — new domain/helpers/ precedent, absent-vs-empty null-aggregate modeling, and the revalidate-ordering bug (see feedback_revalidate_swr_key_throws_in_catch.md)
metadata:
  type: project
---

Reviewed on branch `feat/lns-564-tiered-pricing-frontend` against base `release/tiered-pricing` (5 commits, ~78 files). Overall very high quality — extensive doc-comments explaining *why* for every deliberate deviation, and a real Vitest suite (new to this repo) covering pure-function edge cases precisely (absent-vs-empty JSON parsing, GRADUATED/VOLUME arithmetic, idempotency-rotation sequencing, request-body key omission asserted on the *serialized* payload, not just the object).

**New pattern: `domain/helpers/`.** `features/product/domain/helpers/price-tier-preview.ts` is the first file anywhere in the codebase under a `domain/helpers/` directory (checked: existing `domain/` subdirs across every feature are only `constants, entities, enums, factories, guards, repositories, sources, types, usecases`). It's a pure, side-effect-free calculation over domain entities (a display-only price preview) with no data/presentation imports, so it's architecturally sound — but it's a new taxonomy entry not documented in CLAUDE.md. Flagged as a 🔵 Suggestion, not a violation. **How to apply**: if this recurs in a future PR, it's no longer novel — stop flagging as a Suggestion and just confirm CLAUDE.md got updated; if it didn't, escalate that CLAUDE.md is falling behind actual convention.

**Absent-vs-empty nullable aggregate, done right**: `PriceTierScheduleEntity | null` on `VariantEntity`/`VariantForSaleEntity` (null = "this read path never hydrates schedules", non-null-with-`[]` = "hydrated and genuinely flat-priced") is exactly the "one nullable aggregate, not two nullable fields" pattern called out as a deliberate decision, and it's enforced structurally: `PriceTierScheduleTable`/`PriceTierSummary` take a **non-nullable** `schedule` prop, so a caller is forced to narrow before mounting them — the "not hydrated" branch cannot be read past by accident. Good reference example for future "sentinel vs real-empty" modeling questions.

**Money/quantity correctness was exemplary**: `previewLinePrice` (GRADUATED blending, VOLUME cliff pricing) is pure, well-tested, and structurally cannot reach a request body — confirmed by grep (only consumed in `cart-item-row.tsx` render and `pos-provider.tsx`'s local `total`), plus `create-pos-sale-body.test.ts` asserts `unit_price` is absent from the *serialized* JSON (not merely `undefined`), which is the correct level of paranoia for this class of bug.

**Idempotency-key rotation** (rotate on 4xx only, keep on 5xx/network/409-in-progress) was correctly implemented and tested with a "submission sequence" simulation, not just unit-level truth-table checks — good model for reviewing future retry/idempotency logic.

**The one real Major finding**: see [[feedback_revalidate_swr_key_throws_in_catch]] for the new "success-path ordering" variant found in `price-tier-edit-dialog.tsx` and `price-tier-copy-dialog.tsx`. Worth re-checking any future mutation-confirmation dialog against the safe sibling-file precedent (`product-detail-provider.tsx`, `product-detail-delete-button.tsx`: revalidate *before* toast/close).

**Mutation SWR keys still hardcoded strings** (`useSWRMutationClerk("save-price-tiers", ...)` etc.) — confirmed via grep this is the *universal* convention across every mutation hook in the `product` feature already (14+ existing sibling hooks), so the new hooks conforming to it is not a fresh deviation. Consistent with [[project_lns371_review_learnings]]'s finding that this is a repo-wide pattern, not feature-specific.
