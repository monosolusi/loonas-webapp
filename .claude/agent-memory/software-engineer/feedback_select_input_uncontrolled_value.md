---
name: select_input_uncontrolled_value
description: SelectInput (and any raw <select>) must never receive value={undefined} — the browser silently auto-selects the first option
metadata:
  type: feedback
---

`SelectInput` (`src/core/presentations/components/select-input.tsx`) now coerces `value ?? ""`
onto the underlying `<select>` (mirroring `TextInput`'s `value: cleanedProps.value ?? ""`),
applied AFTER the props spread in `cleanedInputProps`. Before this fix, a caller passing
`value={undefined}` (e.g. an uninitialised form-buffer field) made React treat the `<select>`
as UNCONTROLLED — per the HTML select-reset algorithm the browser then auto-selects the first
non-disabled `<option>`, silently committing a phantom value while `SelectInput`'s own
placeholder-overlay/`hasValue` logic masks it visually so the field *looks* empty. Worse: if
the user opens the dropdown and taps the already-highlighted first option, no change event
fires and state stays empty forever with no feedback.

**Why:** root-caused during the onboarding "Tanggal Lahir" fix — three uncontrolled `SelectInput`s
defaulted to day 1 / Januari / current-year (the year list descends, so current year sorts first),
producing a fabricated birth date the user never picked.

**How to apply:** any time you build a new controlled-select-backed field (or review one), verify
the value prop threading never bottoms out at `undefined` on first render. `SelectInput` itself is
now defensive, but don't rely on that alone — an uninitialised provider/form-buffer field is the
recurring source (see [[project_lns379_opening_balance_wizard]] for the same "uninitialised buffer
committed as a phantom value" defect class in a different feature). Also verify raw multi-part
form buffers (day/month/year, etc.) never let a partial pick get filled in with defaults
(`day ?? 1`) to satisfy a validity check — that fabricates data the user never entered.
