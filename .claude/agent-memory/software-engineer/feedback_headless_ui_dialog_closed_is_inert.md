---
name: headless-ui-dialog-render-both-siblings
description: For two mutually-exclusive dialogs, render both as siblings driven by `open` — the wrapping Transition unmounts the closed one only after its leave animation, which an early return would skip
metadata:
  type: feedback
---

When one of two mutually-exclusive dialogs must show, render BOTH unconditionally as siblings and drive each with its own `open` flag. Do not branch with an early return that swaps which one is rendered.

**Why:** verified against the installed `@headlessui/react` **2.2.9** source. `DialogFn` wraps `InternalDialog` in a `<Transition show={open} transition unmount={rest.unmount}>`. `LoonasDialog` forwards no `unmount` prop, so `rest.unmount` is `undefined` and the **Transition's own default of `true`** applies (`dist/components/transition/transition.js`: `unmount:S=!0`) — meaning **a closed dialog IS removed from the DOM**. (`InternalDialog` separately defaults `unmount` to `false`, `dist/components/dialog/dialog.js`: `unmount:y=!1` — that is the inner default and never gets to apply, because the outer Transition has already unmounted the subtree. Do not cite it as the reason a closed dialog stays mounted; it does not stay mounted.) A closed sibling is therefore inert — no second focus trap, no competing escape/outside-click handler — because it is gone, not because it is hidden. The reason to keep it *rendered* is the transition: `DialogBackdrop` and `DialogPanel` carry `transition`, so the Transition plays their leave animation and unmounts only after it completes. An early return tears the whole `<Dialog>` down synchronously, so the outgoing dialog pops away with no fade.

**How to apply:** two-branch dialogs (`stock-adjustment-dialog.tsx`: blocked vs form) render both children as siblings with `open={cond}` / `open={!cond}`. Give the second dialog the same prop shape the first already has (`open: boolean; entity: T | null`) so they read as siblings. Keep body content structurally rendered and use `entity && <X/>` for values only — gating the whole body on the entity collapses the panel mid-fade, since the entity goes null before the transition ends. This does NOT license two dialogs open at once — see [[single-dialog-warn-ack]].
