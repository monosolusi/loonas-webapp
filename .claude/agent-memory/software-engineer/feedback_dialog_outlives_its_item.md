---
name: dialog-outlives-its-item
description: A dialog's entity prop goes null while its ~200ms leave transition still renders the body — latch the entity in the dialog; never widen a helper's signature to absorb the null
metadata:
  type: feedback
---

When a dialog takes `entity: T | null` with `open={!!entity && …}` (the
`StockAdjustmentDialog` shape), closing nulls the entity **first**; the
`LoonasDialog` panel then plays a ~200ms `data-leave` fade while still rendering
the body. That final pass has nothing to render from, so every
`{entity && …}` field blanks mid-fade.

**Fix it in the dialog, with a latch** — `useLatchedValue`
(`core/presentations/hooks/use-latched-value.ts`) holds the last non-null value
and returns the current one when there is one, so a newly-opened dialog is never
a frame behind. Render the whole body from the latch. An early return on a null
latch is safe: null only before the dialog has ever opened, when Headless UI
renders nothing anyway, so no leave animation is skipped.

**Why:** I first absorbed the null into the *helper* (`stockRecoveryActions(item:
StockItemEntity | null)` with a purchasing-only floor). Arch-review overruled it:
the premise was right but the fix was in the wrong layer and was only *partial* —
it stabilised the footer while the item name and balance figure directly above it
still blanked, degrading the callout to "Saldo stok saat ini  — penyesuaian stok
hanya bisa…". Pushing dialog-lifecycle concerns into a pure helper also weakens
its signature for every other caller.

**How to apply:** before extracting a `(entity) => X` helper out of a dialog
body, check whether the entity can be null while `open` animates out. If it can,
latch in the dialog and keep the helper's parameter non-null. Two constraints
learned the hard way: land the latch and the narrowing in the **same** change (a
narrowed helper alone crashes where the caller dereferences
`actions[length - 1]`), and do **not** "fix" it by passing a primitive
(`isFinishedGoods: boolean`) — that reintroduces the primitive obsession the
extraction removed. Apply to the structural twin in the same pass: the blocked
and form dialogs both needed it. Related: [[feedback_headless_ui_dialog_closed_is_inert]].
