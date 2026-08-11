---
name: feedback_tailwind_child_variant_beats_child_utility
description: Tailwind v4's *: direct-child variant on a parent deterministically beats a same-specificity utility written directly on the child, regardless of source order — use it to fix "sibling flex-basis fights" robustly
metadata:
  type: feedback
---

Tailwind v4's `*:` variant (targets direct children, e.g. `sm:*:w-auto`) is
generated **after** regular utility classes in the compiled stylesheet. Per
the official docs: "utilities applied directly to a child element cannot
override styles provided by the parent's `*:` variant because both rules
have the same specificity and the child rules are generated after regular
utilities." Verified empirically in this repo's `npm run build` output
(`.next/static/css/*.css`): `:is(.sm\:\*\:w-auto>*){width:auto}` sits inside
the same `@media (min-width:640px)` block as, and after, `.sm\:w-auto` /
`.sm\:w-full` / `.sm\:shrink-0`.

**Why this matters:** it means a parent-level `*:` rule is a robust,
cascade-order-safe way to force a property on every direct child — no
`!important`, no arbitrary-variant tricks, no dependence on which file's
CSS loads last. It beats the child's own utility class even if that
utility is `sm:w-full` written directly on the child.

**How to apply:** when a shared component's children can each carry their
own conflicting width/sizing utility (buttons that hardcode `w-full` in
their base, callers sometimes overriding with `w-auto`), fix it once on the
parent with `sm:*:{utility}` instead of chasing every call site. See
`src/core/presentations/components/dialog-footer.tsx`
(`sm:*:w-auto sm:*:shrink-0`) — fixed the "primary button label wraps to
two lines" bug across every `DialogFooter` consumer in one line, this
refactor (branch `refactor/dialog-footer-single-row`). Only reaches **direct** children — a
`<Link>` wrapper around a `<Button>` gets the override, but the `<Button>`
grandchild inside it does not (it still resolves correctly via shrink-to-fit
through the now-auto-width Link, so this is usually fine — verify by
render, don't assume).
