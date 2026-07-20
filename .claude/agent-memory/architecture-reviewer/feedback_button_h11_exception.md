---
name: button-h11-exception
description: Text-link-style buttons that self-constrain to inline/auto height do not require h-11; h-11 applies to form-interactive controls (inputs, selects, real buttons in forms)
metadata:
  type: feedback
---

The CLAUDE.md `h-11` rule targets buttons/inputs/selects that are interactive form controls in the conventional sense. Inline text-link-style `<button>` elements that intentionally have `auto` height (e.g., `UseOtherAccountAction`'s "Pakai Akun Lainnya") are not subject to the `h-11` requirement. The rule's intent is consistent vertical rhythm for form controls, not for every `<button>` in the DOM.

**Why:** Established by LNS-387 review. The `<div>`→`<button>` a11y upgrade in `use-other-account-action.tsx` intentionally keeps `p-0` / auto height for a text-link appearance. Flagging as `h-11` violation would be incorrect because this is not a form control — it is a semantic anchor replacement.

**How to apply:** When reviewing `<button>` elements, check if they are styled as text links (no background, no border, inline-ish). If so, do NOT flag missing `h-11`. Reserve the flag for buttons that look like buttons (filled, outlined) or for inputs/selects.
