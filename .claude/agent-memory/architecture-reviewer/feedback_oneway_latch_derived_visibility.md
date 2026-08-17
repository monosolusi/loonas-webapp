---
name: oneway-latch-derived-visibility
description: When a UI notice's visibility is derived from a boolean latch that only resets via one specific writer, check whether user edits alone can make the derivation lie
metadata:
  type: feedback
---

A "derive visibility instead of adding a dismiss callback" pattern is only safe if the derivation is
monotonic in the direction the user can actually move through the UI. Check: can the user reach a state
where the DERIVED condition re-becomes true without the WRITER re-firing?

**Why**: found in the F9 nationality-reset branch (`identity-number-input.tsx`). `identityNumberCleared`
is boolean state, set `true` only by `changeNationality()` on a genuine nationality switch, never reset
by typing. Visibility was derived as `identityNumberCleared && value === ""`. This holds forward (type
something → notice hides, since `value !== ""`) but not on a round-trip: type something → delete it all
back to empty → the latch is still `true` from the earlier switch → the "your citizenship status just
changed" notice reappears, now describing an edit that didn't just happen. Verified dormant in that PR
only because the enabling condition (WNA selectable) was independently gated off (`disabled: true`), not
because the derivation itself was correct — the code was explicitly built forward-compatible for WNA,
so the bug ships live the instant that flag flips, with no further code review of this file.

**How to apply**: when reviewing a "derived, not dismissed" visibility pattern, trace the state through
at least one type→undo→type-empty-again cycle, not just the single forward transition the author's
comment describes. If the latch can't distinguish "cleared and untouched since" from "cleared, edited,
then emptied again by the user's own action," it needs a second dimension (e.g. dismiss-on-first-edit,
tracked locally, not via a `useEffect` keyed off the upstream trigger — that reintroduces the exact
`useEffect`-resets-touched anti-pattern the same branch correctly removed elsewhere). See
[[project_f9_nationality_reset_review_learnings]].
