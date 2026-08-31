---
name: null-sentinel-picker-omit
description: Before flagging a dialog's "null = untouched → omit key" PATCH sentinel as an undefined/null-clear conflation (LNS-573 class), verify the picker can actually produce a null selection
metadata:
  type: feedback
---

A dialog that maps "picker untouched" to `null` and then omits the key on the PATCH
(`accountId: accountId ?? undefined`, absent = server keeps current) looks like the LNS-573
undefined-vs-null conflation. It is only a defect if an explicit user *clear* is reachable —
otherwise the sentinel is exact and flagging it asks for machinery nobody needs.

**Why:** found on LNS-742's edit dialog (2026-08-31). The conflation would mean: user clears the
account, hits Simpan, gets "berhasil diubah", and the old account silently survives. But the
underlying `core/presentations/components/search-combobox.tsx` has **no clear affordance** — no
X button, no clear option, and Headless UI's `Combobox` does not emit `onChange(null)` on query
text deletion — so `null` is produced by nothing except the initial state. Grep for
`onClear|clear|XMark` and read the component before trusting the props type: `onChange: (value:
T | null) => void` admits null without any UI path producing it.

**How to apply:** when a diff sends `x ?? undefined` (omit) from a picker-backed field, check the
actual picker component for a reachable null-producing path. Safe here as long as
`SearchCombobox` stays clear-less — if someone later adds a clear button to it, every dialog
using this sentinel inherits the silent no-op at once, so the check is per-consumer of the
sentinel, not just at first write. Note the account on a cash category is server-mandatory
anyway, so "clear" would be an invalid operation regardless — the stronger reason the sentinel
is right.
