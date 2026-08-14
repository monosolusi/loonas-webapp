---
name: components-cross-route-locality-violation
description: a page's _components/ folder is implicitly private to that route; a sibling route importing from it is a real, checkable locality violation, not a false positive — verify via grep-all-consumers before flagging
metadata:
  type: feedback
---

Found in the LNS onboarding stray-JSX-artifact review (2026-08-14):
`src/app/(user)/onboarding/account/@accountType/_components/go-to-sign-in.tsx` imports
`UseOtherAccountAction` from `src/app/(user)/onboarding/kyc-summary/_components/use-other-account-action.tsx` —
one page route reaching into a different page route's `_components/` folder.

**Why this is a real finding, not a stretch**: CLAUDE.md's page-level provider/component pattern treats
`_components/` as scoped to its owning route ("Components in `_components/` consume context individually" —
implicitly, *that route's* context). Grepping all importers (`grep -rn "use-other-account-action"`) showed 3
consumers: 2 inside `kyc-summary/_components/` itself (fine — same route) and 1 from `account/@accountType/`
(the violation). Three call sites across two routes is confirmation the component is genuinely shared, not an
accidental one-off — that's the bar for flagging this as a real locality issue rather than noise.

**How to apply:**
1. When a `_components/` file imports another `_components/` file from a *different* route directory, grep every
   consumer of the imported symbol before writing the finding. If all other consumers live in the exporting
   route, it's a real cross-route reach.
2. Correct fix: promote to the **nearest common ancestor** `_components/` folder of all consuming routes — in
   this case `onboarding/_components/` (sibling routes `account/` and `kyc-summary/` are both under
   `onboarding/`). This is precedented in-repo: `step-indicator-with-time.tsx` already lives at that exact tier
   for the same reason (shared across onboarding steps). Do not over-scope to a feature-level
   `features/{feature}/presentations/components/` — page-composition sharing across sibling routes stays at the
   app-router tier, feature-level is for domain/feature reuse.
3. **Classify as pre-existing tech debt, not change-introduced**, unless the diff under review actually created
   the cross-route import — check via `git diff`/git blame on that specific import line, not just on the file.
   Same treatment as [[project_lns457_review_learnings]]'s change-introduced-vs-pre-existing discipline.
