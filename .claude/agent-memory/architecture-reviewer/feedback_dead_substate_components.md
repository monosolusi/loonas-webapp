---
name: dead-substate-components
description: Engineers scaffold sub-state components (loading/error/incomplete) then handle states inline in the body component, leaving the sub-state files unused
metadata:
  type: feedback
---

When an engineer builds a feature-block component that can show multiple states (loading, error, incomplete, success), they sometimes generate sub-state sibling files (`*-loading.tsx`, `*-error.tsx`, `*-incomplete.tsx`) but then handle the states inline in the body component rather than delegating. The result is dead code files that are never imported.

**Why:** Found in LNS-347 — `RecommendedPriceBlockLoading`, `RecommendedPriceBlockError`, and `RecommendedPriceBlockIncomplete` all existed but were never imported. `RecommendedPriceBlockBody` handled all states via `RecommendedPriceValueDisplay` inline. This is a Minor/Convention finding — not a layer violation, but inconsistent with the split-component pattern used by peer blocks (HppBlock, CostStructureBlock, GrossProfitBlock all delegate to named sub-state sibling components).

**How to apply:** During review, if a component renders multi-state logic inline, grep for peer `*-loading.tsx`/`*-error.tsx`/`*-incomplete.tsx` files in the same directory. If they exist but are never imported, flag as Minor dead code — recommend either deleting the dead files or refactoring the body to delegate to them for consistency.
