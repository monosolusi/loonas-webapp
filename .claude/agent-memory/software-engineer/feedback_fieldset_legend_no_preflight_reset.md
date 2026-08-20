---
name: fieldset_legend_no_preflight_reset
description: This project's Tailwind v4 preflight does not reset fieldset/legend UA styles — must reset manually, and legend should not be a flex child
metadata:
  type: feedback
---

Confirmed by grepping `node_modules/tailwindcss/preflight.css` (v4.2.1): there is no `fieldset`
or `legend` rule at all. Unlike `button`/`input`/`select`/`textarea` (which get `font: inherit`
etc.), a native `<fieldset>` keeps the browser UA stylesheet's default border/padding/margin, and
`<legend>` keeps its default inline padding — both need explicit reset classes when used
(`className="m-0 min-w-0 border-0 p-0"` on the fieldset, `p-0` on the legend) or the group will
render with an unwanted grooved border and inset spacing.

Separately: don't make `<legend>` a flex child of a `flex flex-row` fieldset expecting it to sit
above the row — its "rendered legend" special-casing inside a flex/grid fieldset is a relatively
recent CSS spec addition and not a pattern already used elsewhere in this codebase, so don't rely
on it being universally correct. Instead structure as `<fieldset>` (block, `flex flex-col` at most)
→ `<legend>` → an inner `<div className="flex flex-row ...">` wrapping the actual row content.

**Why:** hit fixing `nationality-radio-group.tsx` (LNS onboarding DOB/required-marker fix) — the
original code had `<legend>` as an invalid SIBLING before `<fieldset>` (broken markup, WCAG
violation), and the naive fix of moving it inside a `flex flex-row` fieldset would have put the
legend beside the radio items instead of above them.

**How to apply:** any time a native `fieldset`/`legend` pair is introduced or fixed in this repo
(radio groups, checkbox groups needing a shared a11y label), apply both resets and use the
block-fieldset + inner-flex-wrapper structure above.

**Reserve native `fieldset`/`legend` for fixing already-broken markup, not for new grouped-control
labels.** On the same ticket, EL first asked for the sibling "Tanggal Lahir" day/month/year group
(three `SelectInput`s in a row) to ALSO switch from `role="group"` + `aria-labelledby` (`useId`) to
`fieldset`/`legend`, then reverted that specific call one message later: `<legend>` doesn't
participate reliably in flex layout across browsers, and this label needed to render pixel-identical
to the plain `TextInput`/`SelectInput` labels stacked directly above it in the same form. Net rule:
`role="group"` + `aria-labelledby` is an exact a11y equivalent with zero layout risk, and is the
right default for a NEW multi-control group inline with other div/span-labeled fields. Reach for real
`fieldset`/`legend` only where one already exists and is broken (as in `nationality-radio-group.tsx`
here), or where the group is visually isolated enough that legend's layout quirks don't matter.
