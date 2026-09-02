---
name: route-through-entity-getter-via-structural-type
description: When a pure _utils/ helper re-derives an entity's derived-invariant predicate (LNS-608 class defect), fix by having the helper accept a structural subset type and branch on the getter — not by importing the entity class into the util.
type: feedback
---

When an architecture review flags a `_utils/*.ts` helper re-spelling a predicate that already
exists as a getter on a domain entity (the CLAUDE.md "derived-invariant getter" / LNS-608 class of
defect — see `[[feedback_use_case_owns_business_decisions]]`-adjacent rules in CLAUDE.md), the fix
is:

1. Define a structural type in the util file itself, e.g. `type CorrectionCellInput = { readonly
   isCorrection: boolean; readonly correctsMovementId: string | null }` — narrow to exactly the
   fields the util needs.
2. Change the function signature to take that structural type instead of the raw field
   (`correctsMovementId: string | null` → `movement: CorrectionCellInput`).
3. Branch on the boolean getter's field first (`if (!movement.isCorrection) return
   {kind:"none"}`), then narrow the nullable raw field with a documented `as X` (or non-null `!`)
   asserting the entity's own invariant guarantees consistency — do NOT re-check
   `correctsMovementId === null` as a second condition, that reintroduces the re-derivation the
   fix is for.
4. At the call site, pass the entity instance directly (`classifyCorrectionCell(movement)`) — the
   entity structurally satisfies the narrower type, no explicit mapping needed.

**Why:** this keeps the util decoupled (no import of the entity class, still independently
testable with plain object literals in Vitest) while making the entity's getter the ONE place the
predicate is computed — a parallel re-derivation can no longer silently drift from the getter
(LNS-608 was exactly two definitions of the same rule disagreeing after an unrelated edit to one).

**How to apply:** whenever a fix brief says "take the entity (or a structural type)" for this class
of finding, prefer the structural type over threading the actual entity class into `_utils/` — it
keeps the test file free of entity-construction boilerplate and avoids a new import dependency from
a presentation-layer util onto a domain entity module it doesn't otherwise need. Confirmed correct
on LNS-756 balance-movement F1 fix (`movement-row-display.ts::classifyCorrectionCell`).
