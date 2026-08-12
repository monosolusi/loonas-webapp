---
name: helper-owns-which-not-how
description: A shared helper owns which options apply, never how they rank on screen — encoding a rendering hierarchy in the helper is the part that breaks when a surface redesigns
metadata:
  type: feedback
---

When extracting a shared list of options (recovery paths, actions, CTAs), the
helper owns **which** options apply to an entity. Each surface owns **how** it
presents them. Never encode presentation in the helper's contract — no "ordered
least- to most-prominent", no "the last one is the primary button", no consumer
doing `slice(0, -1)` / `[length - 1]` to recover a hierarchy the helper implied.

If two surfaces present the same options differently (one as an inline link, one
as a button row), export the **predicate** alongside the list so the odd surface
reads the rule without inheriting a layout: `canRecoverByProduction(item)` next
to `stockRecoveryActions(item)`, both implemented in terms of the predicate.

**Why:** LNS inventory stock-adjustment. My `stockRecoveryActions` documented
"ordered least- to most-prominent, last action is the primary button". A sibling
PR then redesigned the blocked dialog — production demoted to an inline link, the
footer fixed at two actions for every item type. *Which* paths apply had not
changed at all, but the consumption pattern died instantly and the contract had
to be reshaped mid-merge. The presentation-coupled half of the contract was the
only half that broke.

**How to apply:** when writing a helper's docstring, if a sentence describes
*rendering* (order, prominence, primary/secondary), that sentence belongs in the
consumer. Ordering by a domain fact is still fine — "purchasing first, it is the
universal path" is about the paths, not the buttons. Related:
[[feedback_second_instance_means_extract]].
