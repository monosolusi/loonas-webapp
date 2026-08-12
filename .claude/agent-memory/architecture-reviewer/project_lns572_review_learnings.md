---
name: project-lns572-review-learnings
description: LNS-572 (create-page single-variant recipe fix) review findings and judgment calls — clean review, confirms the sole-writer/sole-reader sentinel idiom generalizes
metadata:
  type: project
---

Reviewed `fix/lns-572-create-single-variant-recipe` (base `release/tiered-pricing`): new
`products/create/_utils/build-variant-params.ts` (`resolveVariantRows` + `buildVariantParams`) plus
wiring in `product-create-provider.tsx` / `product-create-recipe-card.tsx`. Zero Blockers/Majors/Minors
— genuinely clean. Two non-blocking observations worth remembering for future reviews:

- **The [[project_lns570_review_learnings|LNS-570]] "sole writer + sole reader, private sentinel key,
  never exported" idiom is now confirmed twice** (`sync-variants.ts` on the detail page,
  `build-variant-params.ts` on the create page) — same shape: a module-private string constant
  standing in for a synthetic single-price row, doc comment explicitly citing the sibling precedent
  by name. Treat this as the established repeatable pattern for "form has a single-price mode that
  needs a synthetic row" going forward, not something to re-litigate per instance. Verify with a
  whole-tree grep for the literal sentinel string (e.g. `"default"`) rather than trusting the doc
  comment's claim — that's what actually confirms single-source-of-truth, not just plausible.
- **A boolean flag arg gating one `if` inside an otherwise-uniform `.map()` is not itself a
  violation.** `buildVariantParams({ rows, isManufactured, recipes })` branches once on
  `isManufactured` to decide whether to attempt a recipe attachment. Considered recommending the
  caller pre-filter (`recipes: isManufactured ? recipes : new Map()`) to drop the flag, but concluded
  that only moves the same domain fact one level up without removing it — and the whole point of the
  ticket was reducing mode-check duplication. Landed this as a Suggestion, not a Minor. Reusable
  judgment: a single-guard boolean arg inside a map callback is not a Rule/SRP violation on its own;
  only flag when the boolean forks a genuinely separate code path (multiple divergent branches), not
  a single opt-in attachment.
- **Verified the "wire-identical" claim, don't just trust the docstring.** The module doc claimed
  omitting `recipe` vs. emitting `recipe: []` is wire-identical because the HTTP layer only attaches
  the key when non-empty. Confirmed directly against `data/sources/product.ts:120-123`
  (`if (v.recipe && v.recipe.length > 0)`) rather than accepting the comment at face value — this is
  the kind of claim worth spot-checking every time since it's exactly the class of thing that silently
  goes stale.
- Ran `npx vitest run <file>`, `npx tsc --noEmit`, and scoped `npx eslint` as read-only verification
  before writing the report — all clean. Worth doing for narrow, well-tested diffs like this one; gives
  the EL objective evidence beyond static reading.
