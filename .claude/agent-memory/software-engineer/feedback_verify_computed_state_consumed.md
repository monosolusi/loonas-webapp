---
name: verify-computed-state-consumed
description: Before completing, confirm every computed validation/error state is rendered AND every helper authored is actually called; escalate plan-forced incompleteness instead of shipping a tradeoff
metadata:
  type: feedback
---

Before marking a task complete, confirm that every piece of computed validation/error/guard state (e.g. `rangeError`, `validationError`, `isDisabled`) has at least one render or consumer site in the affected components. State that is computed but never consumed is dead code and typically produces a blank or broken UI — the user gets no feedback.

If a planning constraint prevents the correct fix (e.g. "don't modify the hooks" forces a guard that can't actually prevent the action), surface it as a **blocking question to the Engineering Lead before completing** — do not ship it as a "known tradeoff" in the completion report.

**Why:** On LNS-374 the first pass computed `rangeError` in both providers but neither impl rendered it, and the same-year guard didn't stop the fetch — an invalid range produced a blank panel. It was filed as a "known tradeoff" and shipped, then came back as a MAJOR finding requiring a fix cycle.

**How to apply:** As a pre-completion self-check, grep each computed error/guard variable for a consumer in the render path. This applies equally to **helper functions/utilities** added in the PR — a new `export function`/`export const` helper with zero call sites in the render or action path is dead code and means the AC it was meant to satisfy is not closed; grep new exported helpers for a consumer too. If a constraint blocks the fix, escalate rather than ship. The correct fetch-gating mechanism is the SWR null-key — see [[swr-conditional-enabled]].

**LNS-117:** `getCodeRangeHint()` was authored but left unwired (zero call sites) — a partial AC shipped as "done," caught by QA + architecture-review.

**State-transition render branches (LNS-378):** When an AC says "show X on success" and the success action flips a boolean that gates which components render (e.g. `locked`→unlocked on reopen-year, `isActive`→inactive), the artifact you must surface may belong to a render branch that *disappears* on success — the pre-success branch is gone, so wiring X only there surfaces it nowhere. Verify X is rendered in the POST-transition branch set, not merely returned by the call. On LNS-378 the reopen-year `reversalJournalId` was returned by the hook but discarded, because the only journal-reference render site was gated on `isLocked` — which reopen clears — so the id was invisible until a transient post-success state slot was added.
