---
name: declaration-table-over-paired-branches
description: When two functions must stay in a superset/subset (or otherwise correlated) relationship, replace independently hand-written branch pairs with one declaration table projected via filters — makes the relationship structural instead of convention-plus-test; correlated single-fact predicates then become projections over the table too, not parallel one-liners
metadata:
  type: feedback
---

When a module exports two (or more) functions that each return a filtered/derived
view of the same conceptual list of items, and a written invariant relates them
("B is always a superset of A", "A never contains X"), do not implement each as
its own `if (condition) return [...]` branch pair. Two independently written
array literals *can* be kept consistent by a doc comment and a test, but nothing
in the implementation forces it — the same drift class CLAUDE.md documents for
entity predicates (LNS-570, LNS-608): restating a fact in two places creates two
rules that can diverge.

Instead declare one table where each row states its own facts once —
applicability and whatever axis the two functions filter on — and make both
public functions pure filters/maps over that table:

```ts
type Rule = { action: Action; someGate: boolean; someOtherFact: boolean };
const RULES: readonly Rule[] = [ /* one row per action, in menu order */ ];

function applicableRules(item): Rule[] {
  return RULES.filter((r) => !r.someGate || item.satisfiesGate);
}

export function listA(item) { return applicableRules(item).map((r) => r.action); }
export function listB(item) {
  return applicableRules(item).filter((r) => r.someOtherFact).map((r) => r.action);
}
```

Because `listB` filters the same table `listA` maps over, "B is a superset of A"
and "menu order is defined once" hold **by construction** — no branch to keep in
sync, no drift possible even if a future action is added incorrectly (a missing
row just doesn't show up anywhere, it can't show up inconsistently).

**Why:** LNS inventory `stock-item-actions.ts` — arch-review flagged
`stockRecoveryActions()` / `stockItemNavigationActions()` (four hand-written
array-literal branches across two functions) as a Major because the documented
"navigation is always a superset of recovery" and "a sale never recovers" facts
were held together by doc comment + test only. Rejected the reviewer's first
suggested remedy (derive navigation by splicing sale into a copy of recovery's
order) because that encodes menu *order* as a function of the other list's
order — a coincidence, not a rule. The declaration-table form was preferred:
each action's facts live on its own row, both functions become filters, order
is defined once by table order.

**How to apply:** reach for this whenever you're about to write a second
`if (gate) return [...longer]; return [...shorter]` branch pair alongside an
existing one over the same conceptual items — especially when a doc comment
already claims a subset/superset or exclusion relationship between the two
outputs. Then sweep the rest of the module for predicates the table now
subsumes: once the table is the single source, a correlated single-fact
predicate belongs as a **projection over it**, not as a parallel one-liner
reading the entity directly. `canRecoverByProduction` shipped as
`stockRecoveryActions(item).includes(RECORD_PRODUCTION)`, not
`item.isFinishedGoods`. The one-liner is correct today and reads more
directly — which is exactly why it survives the refactor unnoticed — but it
restates `finishedGoodsOnly`, a fact the table already carries, so flipping a
row's flag silently stops reaching it. The projection also makes the name
honest: a function called `canRecoverByProduction` should read the recovery
list it is named after. The tell that surfaced it was a doc comment claiming
"the one spelling of the rule" sitting on a function that, once the table
landed, was no longer the one spelling — when a refactor leaves a comment
overclaiming, the comment is pointing at leftover work, not asking to be
softened. Related: [[feedback_helper_owns_which_not_how]] (this is the same module,
prior round — that memory is about presentation vs. which-applies; this one is
about how to keep two which-applies functions from drifting from each other).
