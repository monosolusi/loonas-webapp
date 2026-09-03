---
name: latched-display-value-drives-disabled
description: A useLatchedValue display prop must never gate a submit button — the latch survives dialog closes, so it re-enables the button in a state the live writer rejects
metadata:
  type: feedback
---

When a dialog impl latches a display value (`useLatchedValue`) for the LNS-742 close-fade and then
passes it as the same prop the form dialog's `disabled` reads, the button state derives from the
**stale display** value while `onSubmit` derives from the **live** one. `useLatchedValue` is not
reset on open, so the latch carries a *previous* record's value into the next open.

**Why:** LNS-788 — `cash-category-account-form-dialog.tsx` had `disabled={!account}` where `account`
was `latchedAccount`, while `onSubmit` guarded on the live `account`/`canSubmit`. Opening general row
A (account resolves) then row B (saved account absent from the CoA list) rendered row A's account in
row B's picker, an *enabled* Simpan, and the "akun tersimpan tidak ditemukan" notice — all at once —
and the click did nothing. The resolver even exported `canSubmit` with a doc comment saying it existed
"so the dialog's footer never re-derives the same predicate", and the footer was never passed it.
This is [[the displayed-vs-saved rule]] (CLAUDE.md LNS-570) one layer down, at the latch.

**How to apply:** whenever a diff introduces `useLatchedValue`, trace which props consume the latched
value. Display-only (text, picker `value`) is correct; anything the *writer* also reads — `disabled`,
`canSubmit`, a required-field check — must take the live value or an explicit resolver flag. Ask: can
the latch be non-null while the live value is null? If two records can open the same dialog, yes.

**Second half, found in LNS-788 round 2 — fixing the writer does not fix the display.** After
`canSubmit` was threaded live, the picker still received `latchedAccount`, so row B's "saved account
not found" notice rendered *underneath a populated field showing row A's account*. `useLatchedValue`
is `return value ?? latched`, so it hands back the stale value on EVERY render where the live value
is null — not only during the close fade it was written for. A latch is only correct while the dialog
is closing; scope it (`open ? live : latched`, or gate on the provider's holder being null). The tell:
a latched source that can legitimately be null *while the dialog is open* (a resolver's
missing/error state), as opposed to one derived from the holder itself (`accountCategory?.name`),
which is only null when closing and is therefore safe to latch unconditionally.
**Resolution, LNS-788 round 3 — latch the HOLDER ENTITY, never its derived fields.** The accepted fix
was `const category = useLatchedValue(accountCategory)` with `currentAccountId`, `direction`, `name`
and the resolver call all derived from that single latched entity (net -7 lines, and it deleted the
`open ? live : latched` scoping hack above). This is drift-proof by construction: `useLatchedValue`
returns `value ?? latched`, so while the holder is non-null the latch *is* the live value — no prop
can be stale while open, which dissolves the "does this prop feed a writer?" question entirely, and a
fresh open of a different record supersedes the latch on the SAME render (no leak). Everything
downstream — resolved account, `missingSavedAccountId`, the fetch-error notice — then stays mutually
coherent through the fade instead of each field reverting on its own schedule. Keep `open` keyed on
the LIVE holder (`open={!!accountCategory}`) or the dialog never closes, and keep the error unlatched
(LNS-742 corollary). So: N per-field latches beside one holder is the smell; one holder latch is the
shape. Related: [[feedback_headless_ui_dialog_unmounts_when_closed]], [[project_lns742_review_learnings]].
