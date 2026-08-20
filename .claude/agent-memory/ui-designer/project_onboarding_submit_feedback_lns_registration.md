---
name: project_onboarding_submit_feedback_lns_registration
description: Async-submit feedback state design for /onboarding/user (registration) — thresholds, banner-split rule, and two error-banner precedents to reuse for any future async-submit UI in this app
metadata:
  type: project
---

Design spec for `/onboarding/user` (step 1, email+password Clerk sign-up) submit states, written 2026-08-14
after QA found three bugs: a silent spinner with no text, a false "dead disabled button" after actual success
(race between `isCreating` flipping false and `router.push` completing), and no slow/timeout feedback at all.

**Reusable pattern for any future async-submit UI in this app** — two distinct banner slots, not one:
- **Top-of-form banner** = "is my input wrong" — appears only after a definite failure, sits above the fields
  the user needs to reconsider. Reuse `invalid-cred-alert.tsx`'s tokens: `bg-error-50 border-error-100
  text-error-500`, `role="alert"`, `exclamation-circle-w20-h20.svg` icon (`alt="" aria-hidden="true"`).
- **Below-the-submit-button slot** = "is the system still working" — appears while genuinely waiting, sits
  where the user's eyes already are (they just clicked the button, not the top of the form). Escalates in two
  steps: plain caption at ~8s ("this is taking slightly longer than usual"), then a warning-toned advisory card
  at ~20s (`border-warning-400 bg-warning-50 text-warning-500` + `ClockIcon`) with ONE safe recovery action as
  an inline text link, never a second full-width button next to a still-spinning primary (violates the One
  Signal Rule). Thresholds are NN/g response-time-guidance defaults (1–10s needs a status indicator, >10s
  needs an explicit acknowledgment + honest way out) — flagged as tunable against real latency data, not hard
  requirements.

**The load-bearing rule that fixes "false dead button after real success":** the loading visual (spinner +
`loadingLabel`) must never collapse to a silent/plain disabled state while the outcome is still genuinely
unknown to the user — it only leaves loading once a real terminal outcome (success redirect, or a real error)
is known. A "succeeded/redirecting" bridge state needs its OWN boolean (loading stays true, `loadingLabel`
changes to a positive string like "Berhasil, mengalihkan...") spanning the gap between the async call resolving
and the actual navigation completing — do not let a provider's own `isCreating`-style flag double as this
bridge flag, since it flips false as soon as the mutation itself resolves, before navigation fires.

**Two a11y precedents worth grepping for on any new banner/live-region work in this repo:**
1. `create-user-captcha.tsx` — an `aria-live` wrapper must be ALWAYS MOUNTED before its content arrives; a
   region inserted in the same commit as its text is unreliably announced. (`create-user-form.tsx`'s error
   banner violated this — conditionally rendered the whole wrapper, not just the text.)
2. `onboarding/account/@{personal,business}Account/_components/submit-error-banner.tsx` — on error, use a
   `useEffect` + `ref.scrollIntoView({behavior:"smooth", block:"center"})`, never `.focus()`. Announce via
   `role="status" aria-live="polite" aria-atomic="true"`, don't steal keyboard focus off the form fields the
   user needs to fix.

**Recommended-against (flagged as over-engineering in the spec):** using `Promise.race` to fabricate a timeout
that rejects/abandons the real in-flight request. Leaner and safer: let timers only change what's *displayed*
(caption → warning card), while the real promise is still awaited normally and its real settlement is what
actually ends the loading state. Avoids an orphaned promise that could still mutate state after the UI "gave
up."

Full spec (all states A–L, exact Indonesian copy, color tokens, icon choices) delivered via SendMessage to
`main` in the same session — this memory captures only the non-obvious, reusable decisions, not the copy.
