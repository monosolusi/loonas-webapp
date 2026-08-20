---
name: f10-wna-review-learnings
description: QA F10 review (fix/wna-option-unavailable-explanation) — read/write predicate split is NOT the LNS-608 drift surface; a discriminated union guards a reason's presence but never its emptiness; opacity on the same node as its fill cancels the fill
metadata:
  type: project
---

Review of `fix/wna-option-unavailable-explanation` (QA F10 legibility fix + a folded-in
sweep of five onboarding selects that never read their SWR `error`). Three durable
judgment calls came out of it.

**1. A read-path union + a write-path predicate over the SAME catalogue is a legitimate
single-owner split, not LNS-608 drift.** `nationality-options.ts` exports
`NATIONALITY_OPTIONS` (each entry carrying an `availability` union) and
`isNationalitySelectable(value)`. The card renders from `availability`; the group calls
the predicate as a guard before writing to the form buffer. That is fine, and the tells
that distinguish it from LNS-608 are worth reusing: LNS-608 had (a) **two independent
derivations from a raw field**, and (b) one of them **unused**. Here there is one
derivation — the predicate is a *lookup into* the catalogue, not a restatement — and it
is used. CLAUDE.md's "a second gate at the call site is a divergent UI" rule also does
not reach it, because that rule is about suppressing *affordances*; a write guard that
changes nothing on screen is not a divergent UI.

**2. A discriminated union makes a reason's PRESENCE mandatory and says nothing about its
emptiness.** `{selectable: false; reason: string}` and
`{hasParent: true; parentChosen: boolean; parentHintCopy: string}` both type-check with
`""`, which renders as nothing and reproduces the original defect. The nationality module
closed this with a runtime test over the real catalogue
(`reason.trim().length > 0`); the select-field resolver could not, because its copy lives
as `.tsx`-local `const`s the node-env vitest suite cannot reach. **Whenever a PR claims a
union makes a bad state "unrepresentable", check whether the empty-string case is guarded
and whether the real strings are in a `.ts` module the suite can see.** The fix shape is a
`_utils/*-copy.ts` module plus a non-empty assertion.

**3. `opacity-50` on the same element as its own background cancels most of the
background.** `bg-neutral-100/25 opacity-50` composites to ≈`#FAFAFA` on white (12.5%
effective alpha), not the intended ≈`#F5F6F6` — so a change made specifically to stop
opacity carrying all the disabled signalling left it carrying most of it. Check the fade
and the fill are not on the same node, and that the "reads as one vocabulary as X" claim
is measured against X's actual classes.

**How to apply:** all three are review heuristics, not repo facts. Also confirmed here:
the `domain/helpers/` input-type disqualifier for a 4th time (a module whose output type
carries SVG paths + UI copy belongs in `app/**/_utils/`), and that a *rendered* pending
state beats an unmounted control — a retry button that disappears on click loses focus to
`<body>`, which is the same family as CLAUDE.md's "renders nothing is worse than renders
grey". Related: [[swr-error-stale-data-false-alarm]], [[f9-nationality-reset-review-learnings]].
