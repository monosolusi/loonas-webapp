---
name: single-dialog-warn-ack
description: Warn→ack flow must be inline body-mode switch in ONE LoonasDialog, never a separate sibling dialog
metadata:
  type: feedback
---

When a dialog action returns warnings requiring user acknowledgement, implement two body modes (form view / ack view) within the SAME `LoonasDialog` instance — not as a separate sibling dialog.

Pattern: `pendingWarnings.length > 0` drives an `isAckMode` flag. Dialog title and body switch based on that flag. One `LoonasDialog`, one focus trap, one `open` prop.

**Why:** A separate sibling dialog = a second focus trap. Two dialogs open simultaneously causes focus management issues and was flagged by EL as incorrect (LNS-372 fix loop). The single-dialog inline approach mirrors the pattern already in place in `journal-warning-dialog.tsx` in the create flow.

**How to apply:** Any time a mutation dialog has a "needs-acknowledge" path (BE returns warnings), implement it as an inline mode switch in the same dialog chrome. Extract `*Form` and `*AckView` as separate files (one component per file rule), render the appropriate one based on the pending-warnings flag.
