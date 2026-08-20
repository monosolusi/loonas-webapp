---
name: disabled-state-opacity-fails-aa
description: Never spec opacity-50 as a disabled treatment in this project — no token survives it on white; and bg-neutral-50 as a "disabled surface" is a no-op
metadata:
  type: feedback
---

Never specify `opacity-50` (or any wrapper-level opacity) as the disabled treatment when the
disabled element must carry text the user has to read. Recess with an explicit **color** token
instead (`text-neutral-300` = #323636) plus a fill (`bg-neutral-100/25` ≈ #F5F6F6).

**Why:** Loonas surfaces are pure white (`neutral-50` = #FFFFFF; the onboarding right pane is
literally `bg-neutral-50`). A wrapper `opacity-50` composites every child against white and no
token survives it:

| Token on white | Solid | Under `opacity-50` |
|---|---|---|
| `neutral-200` #BDBDBD | 1.88:1 | **1.35:1** |
| `neutral-300` #323636 | 11.87:1 | **2.81:1** |
| `neutral-500` #0D0E0E | 20.6:1 | **3.62:1** |

Even the darkest ink fails 4.5:1. WCAG 1.4.3 exempts inactive-component text, but PRODUCT.md
sets a blanket AA bar and an *explanation the user must read* is not incidental — so don't lean
on the exemption.

**Second half of the same trap:** `bg-neutral-50` as a "disabled surface" is a **no-op** — it is
#FFFFFF, identical to the page and to an enabled input. `SelectInput` shipped
`disabled ? "cursor-not-allowed bg-neutral-50"`, so `opacity-50` was doing 100% of the work.
Grep for `disabled.*bg-neutral-50` before trusting any existing disabled treatment.

**How to apply:** any time a spec covers a disabled/inert/unavailable state — cards, radio
options, selects, tiles. Build the signal set from: explicit greyed *color*, a `neutral-100/25`
fill, `cursor-not-allowed`, absence of hover/focus response, and a **text** label
(`StatusChip variant="neutral" compact` = `bg-neutral-100 text-neutral-400`, 12.30:1) so the
state never relies on color alone. Do NOT use `border-dashed` to mean "inert" — `Dropzone` owns
that in this vocabulary. See [[design-language-conventions]] and
[[project-f10-unavailable-option-copy]].
