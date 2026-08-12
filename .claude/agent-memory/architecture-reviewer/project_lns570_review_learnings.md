---
name: lns570-review-learnings
description: LNS-570 (single-variant identity) review — domain/helpers purity boundary for I/O-orchestrating app-utils, and a sibling-defect sweep across twin components
metadata:
  type: project
---

LNS-570 (`fix/lns-570-single-variant-identity`, product single-variant save/toggle identity bug)
produced two reusable review patterns:

**1. `domain/helpers/` purity boundary vs. app-layer reconciliation utilities.** A function that
diffs form state against server entities AND fires the add/update/delete network calls itself
(e.g. `products/[id]/_utils/sync-variants.ts`, which takes bound SWR-mutation-hook-trigger
callbacks and awaits `Promise.all` over them) is correctly *disqualified* from
`domain/helpers/` on two independent grounds, not just "it takes a presentation type": (a)
`domain/helpers/` is scoped to pure, stateless, no-DI calculations — a function that performs I/O
via injected callbacks is not pure regardless of what it takes as input; (b) its input
necessarily mixes a domain entity with a presentation-owned type (here `VariantFormRow` from
`_components/variant-table.tsx`), and domain must never import presentation types. Don't accept
"it takes a domain entity as its primary param" alone as grounds to argue FOR a domain/helpers
extraction — check for injected side-effecting callbacks and presentation-typed params first.
See [[feedback_empty_params_class_pattern]] for a related domain-layer shape check.

**2. Sibling-defect sweep across twin display/implementation components.** This PR fixed a
"UI-visible mode diverges from what the save path actually reads" bug in
`product-detail-variant-card.tsx` (was masking `hasVariants` to `false` for SERVICE-type
products while `syncVariants` read the raw unmasked value). The twin component
`product-create-variant-card.tsx` (create-page implementation of the same shared
`ProductVariantCard` display component) has the **identical unfixed pattern**: it still masks
`hasVariants={form.type !== ProductType.SERVICE && form.hasVariants}` while
`product-create-provider.tsx`'s `handleSubmit` builds `variantParams` from the raw unmasked
`form.hasVariants`. Reproducible: pick TRADING + toggle multi-variant + fill rows, switch type to
SERVICE (toggle hides, display collapses to single price, but `form.hasVariants` internal state
stays `true`), submit — the create POST silently uses the hidden stale multi-variant array
instead of what's on screen. Not introduced by this diff (file untouched) so it's Pre-existing
Tech Debt for disposition purposes, but flag prominently — it is the literal sibling of a bug the
PR explicitly named as "the same defect class" and fixed on the other page. General rule: when a
fix changes one implementation-component consumer of a shared display component, always check
the other implementation-component consumers for the same defect shape before calling the defect
class closed.

**3. Good precedent worth citing positively**: `ProductEntity.defaultVariant` getter
(`src/features/product/domain/entities/product.ts`) is deliberately derived FROM the existing
`hasVariants` getter (`if (this.hasVariants) return null; return this.variants[0] ?? null;`)
rather than restating its clauses, specifically so the two cannot drift — this was the root cause
of the original bug (a caller re-deriving the single-price rule independently, and drifting).
Cite this getter-derived-from-getter shape as the canonical "single source of truth" pattern in
future reviews when a similar drift risk shows up.
