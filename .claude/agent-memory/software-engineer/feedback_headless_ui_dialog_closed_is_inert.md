---
name: headless-ui-dialog-closed-is-inert
description: Headless UI Dialog defaults to unmount=false — a closed dialog renders display:none and is fully inert; unmounting it instead kills the leave transition
metadata:
  type: feedback
---

When one of two mutually-exclusive dialogs must show, keep BOTH mounted and drive each with its own `open` flag. Do not branch with an early return that unmounts the inactive one.

**Why:** verified in Headless UI v2 source via Context7. `DialogFn` wraps `InternalDialog` in `<Transition show={open} transition unmount={rest.unmount}>` with `unmount` defaulting to **false**, so a closed dialog takes `RenderStrategy.Hidden` — it stays in the DOM as `hidden + display:none` rather than returning `null`. Every behaviour (focus trap, inertness, escape, outside-click, scroll lock) is gated on `dialogState === DialogStates.Open`, *not* on DOM presence, so the closed one is inert — no second focus trap. The flip side: the leave transition only plays because the component stays mounted. An early return that swaps which dialog is rendered unmounts the outgoing one mid-close, so it pops away with no fade while the incoming one mounts closed.

**How to apply:** two-branch dialogs (`stock-adjustment-dialog.tsx`: blocked vs form) render both children as siblings with `open={cond}` / `open={!cond}`. Give the second dialog the same prop shape the first already has (`open: boolean; entity: T | null`) so they read as siblings. Keep body content structurally rendered and use `entity && <X/>` for values only — gating the whole body on the entity collapses the panel mid-fade, since the entity goes null before the transition ends. This does NOT license two dialogs open at once — see [[single-dialog-warn-ack]].
