---
name: feedback_async_handler_and_swallowed_catch
description: Two recurring async-handler defect shapes — throwing from an async event handler, and a catch block that only rethrows for one recognized error shape and silently swallows the rest — plus the Clerk captcha DOM-injection pattern (ResizeObserver height signal, always-mounted aria-live) found while fixing them.
metadata:
  type: feedback
---

Two defect shapes recur together in this codebase's form-submit flows (found in
`onboarding/user`, LNS registration-captcha fix, 2026-08-13):

1. **Throwing from an async React event handler is a silent no-op to the user.** React does not
   await `onSubmit={async (e) => {...}}`; an uncaught throw inside it becomes an unhandled
   promise rejection with nothing rendered. Fix: extract the error→outcome decision into a pure
   `_utils/classify-*.ts` module (`{ kind: "redirect" } | { kind: "error"; message }`), switch on
   it in the handler, never `throw` from the handler itself. This also makes the decision
   reachable by vitest (node env, `.test.ts` only per CLAUDE.md).
2. **A catch block that special-cases ONE error shape and treats everything else as
   "log and continue" is a false-success trap.** `if (isClerkAPIResponseError(err)) throw ...`
   with no `else throw` falls through to a bare `console.error` and the function *resolves*, so
   the caller (`await createUser()`) proceeds as if it succeeded. Any deliberate `throw new
   ServerError(...)` earlier in the SAME try block gets caught by this same catch and swallowed
   too — not just the "real" unexpected errors. Fix pattern: `if (err instanceof ServerError)
   throw err;` FIRST (rethrow known errors unchanged), then the recognized-shape branch, then a
   final `console.error(err); throw err;` (or a generic wrapped error) — never a bare log with no
   rethrow. Also: `console.error(JSON.stringify(err, null, 2))` on a native `Error` yields `"{}"`
   (message/stack are non-enumerable) — log the raw object instead.

**Clerk Turnstile captcha DOM pattern** (for any future Clerk sign-up/sign-in flow needing bot
protection): Clerk injects the widget into `<div id="clerk-captcha" />` at `signUp.create()`
click time, not on page load — the node must exist beforehand but starts empty. Official order is
fields → `#clerk-captcha` → submit button; this project's registration form had it AFTER the
button, so the challenge rendered off-screen below the fold and the submit button spun forever
(the actual bug, not a network issue). The node must stay permanently mounted and must NEVER be
`display:none`/`hidden` — Turnstile can fail to render/measure inside a hidden container. There is
no app-observable "captcha unsolved" API from Clerk (no error code, no callback).

Two further gotchas surfaced in review (not caught by vitest or the first read of the fix, since
they're runtime/a11y-only):

- **Detecting "the widget was injected" is not the same as "a visible challenge appeared".**
  Clerk injects a container into `#clerk-captcha` on EVERY submit, including the invisible /
  not-flagged path most legitimate users hit. A first-pass `MutationObserver` watching for any
  child mutation fires on that path too, showing a "solve the captcha" hint and scroll-jumping a
  completely successful signup — a false alarm on the common path. The correct signal is the
  container's rendered **height**: use a `ResizeObserver` and only act once
  `entry.contentRect.height > 0`. A zero-height resize must NOT disconnect the observer — Turnstile
  can inject at 0 height and grow it later via style, which a `childList`/`subtree`
  MutationObserver would also miss since it's a pure style change on an already-present node.
- **An `aria-live` region must already be in the DOM before its content changes, or screen
  readers generally announce nothing.** Don't conditionally *mount* the hint paragraph
  (`{visible && <p aria-live>...}`) — mount it always and toggle only its text content
  (`<p aria-live>{visible ? "..." : null}</p>`). Do not hide the empty element with
  `hidden`/`display:none`/`empty:hidden` either — those pull it out of the accessibility tree,
  reinstating the same defect under a different mechanism. If the empty state would otherwise
  leave dead layout space, make spacing (e.g. a margin) conditional on the populated state
  instead of the element's mount/hidden state — that avoids the gap without touching a11y
  exposure.
  - **Caveat found on the follow-up fix (`create-user-wait-notice.tsx`, same page):** the
    "make the element's own margin conditional" trick only works when the PARENT spaces children
    with margins. If the parent is `flex flex-col gap-N` (this codebase's default list/form
    spacing), CSS `gap` inserts a fixed gap between every pair of rendered flex items
    *regardless* of an item's own height/margin — an always-mounted-but-empty `<p>` still
    contributes one full `gap-N` of dead space before it, permanently, even with zero content.
    Fix: mount conditionally on a **state that only ever transitions one way** (e.g. a
    `SubmitStatus` union that starts at `"idle"` and never returns to it), not on the
    visible/empty distinction itself — `if (status === "idle") return null;` before any submit
    has ever happened, then stay permanently mounted from the first non-idle render onward. This
    still satisfies "exists before its content first changes" (the mount and the first real text
    land in different renders, since the slow/redirect copy always arrives after a state
    transition, never in the same commit as the initial mount) while adding zero gap-driven dead
    space during the page's default (idle) state. Prefer this pattern over margin-toggling
    whenever the ancestor uses `gap-*` rather than child margins for spacing.
  - **`role="status"`/`role="alert"` are the exception to "always mount before content arrives".**
    Unlike a bare `aria-live` region, ARIA's alert/status roles are specifically designed to be
    announced by major screen readers WHEN INSERTED, content and all, in the same commit — that's
    the whole point of the role. So a card that only appears at a late threshold (e.g. a
    "submission may have already succeeded, reload to check" advisory shown only once a submit
    has been stuck ≥20s) can be conditionally mounted/unmounted freely
    (`{phase === "stalled" && <div role="status" aria-live="polite" aria-atomic="true">...}`)
    without the always-mount workaround above — which also sidesteps the `gap-*` dead-space
    problem entirely for that piece, since an unmounted item contributes no flex item at all. Only
    a PLAIN `aria-live` paragraph (no role) needs the always-mounted trick; design specs that hand
    you two different treatments for two different urgency levels (a quiet caption vs. a bordered
    warning card with its own role) usually intend exactly this split — mount the plain one
    permanently, mount the roled one on demand. See `_components/create-user-wait-notice.tsx`.

See `src/app/(user)/onboarding/user/_components/create-user-captcha.tsx` for the shipped shape.

**Why:** two Clerk hooks reading the "same" fact can disagree — `useSignUp().isLoaded` and
`useAuth().isLoaded` are separate subscriptions that can resolve at different times. When a
provider already derives a readiness/business flag from one hook, a sibling component must
consume it from context rather than re-deriving from a different hook instance — same class as
[[feedback_verify_computed_state_consumed]] but for cross-hook agreement rather than
unrendered state.

**How to apply:** whenever implementing/reviewing a submit handler with `try/catch` + navigation,
grep the catch for: (a) any path that falls through without a `throw`/rethrow, and (b) whether the
handler itself is `async` and can throw past its own `try`. Both are FE-only concerns (no BE
involvement) and are easy to miss because typecheck/lint/build all pass — this is a runtime-only
defect class. Same caution applies to any DOM-mutation-observer pattern: verify the observed
signal actually correlates with the user-visible state you're trying to detect (injection ≠
visibility), and verify any `aria-live` region is mounted unconditionally.
