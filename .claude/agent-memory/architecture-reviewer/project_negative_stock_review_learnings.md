---
name: negative-stock-review-learnings
description: Review learnings from the negative-stock UX copy/action-hierarchy PR (2026-08-11)
metadata:
  type: project
---

Reviewed `refactor/negative-stock-copy-and-actions` (3 commits vs `release/negative-stock`) — a UX copy + footer-button-reduction fix on `/inventory/negative-stock`. Outcome: Approve, 2 Minor (change-introduced), 0 Blocker/Major. Of the two Minor findings, **one was rejected on review**: the inline-link color finding cited a grep-verified convention without computing its contrast, and the convention turned out to fail AA — see [[inline-link-base-color-convention]] for the corrected rule. Lesson: a pattern's frequency across call sites is not evidence of its correctness; when a finding rests on "the rest of the codebase does X", verify X actually satisfies the bar it is being cited to defend.

**No-shared-component judgment validated**: two call sites (`stock-adjustment-blocked-dialog.tsx`, `stock-adjustment-form-dialog.tsx`) both branch on `StockItemEntity.isFinishedGoods` but were deliberately NOT extracted into a shared `RecoveryActionLinks` component, because (a) the render shapes are genuinely different (inline sentence-embedded link vs. full-width alert-row button) and (b) the actual shared fact — which item types are producible — is already centralized on the entity getter, not duplicated in either render path. Confirmed this holds: extracting a component here would add an indirection layer with a shape-switch prop without removing any real duplication. **General principle for future reviews**: when two call sites share a *predicate* (via a getter) but render genuinely different UI shapes, the drift-prevention unit is the getter, not a shared component — don't flag "should have extracted a component" reflexively just because two files consume the same boolean.

**Removing a footer button ≠ dropping a user path**: when a PR removes an action from a dialog footer, check whether the underlying navigation target got relocated (here: to an inline link + a second surface's alert) rather than assuming removal = dropped functionality. Grep the target route (`/productions/create`) across the whole diff before flagging a reachability regression.

**Loading-state flash on gated static copy**: a pattern worth watching for again — instructional/static paragraph gated by `!loading && confirmed-non-empty` will show optimistically during loading, then hide if the load resolves to genuinely empty. Not a bug per se (common trade-off), but worth surfacing as Minor/advisory since it's a real, testable UI flash — check the hook's `INITIAL_STATE`/loading semantics (is the data field `null` or an empty array during loading?) to confirm the flash is real before flagging.
