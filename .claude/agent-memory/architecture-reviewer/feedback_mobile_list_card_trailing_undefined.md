---
name: mobile-list-card-trailing-undefined
description: MobileListCard gates its trailing column on `!== undefined`, so a conditional trailingTop/trailingBottom must use a ternary yielding undefined, never `cond && <X/>`
metadata:
  type: feedback
---

When a `MobileListCard` (`core/presentations/components/table/mobile-list-card.tsx`) trailing slot
becomes conditional, pass `cond ? <X/> : undefined` — never `cond && <X/>`.

**Why:** the component gates the whole trailing column on
`trailingTop !== undefined || trailingBottom !== undefined`, and renders `{trailingBottom}` raw.
`false` is `!== undefined`, so `cond && <X/>` wrongly satisfies the gate: the flex column mounts
with `gap-1` and no visible child, leaving phantom spacing next to the chevron. Same reading applies
to `subtitle` and `meta`, which use the same `!== undefined` guard.

**How to apply:** whenever a diff makes any `MobileListCard` slot conditional, check the operator.
Verified correct in LNS-781 (`cash-entry-row.tsx` mobile branch). Related:
[[feedback_css_hidden_dual_branch_singleton]] — the desktop `hidden lg:grid` and mobile `lg:hidden`
branches of a row component are BOTH mounted, so a conditional applied to one must be checked on the
other too.
