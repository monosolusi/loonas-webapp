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
