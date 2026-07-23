---
name: inline-validation-hints-required
description: When a brief or UID spec lists field-level validation copy strings, wire each as an inline hint in the form component — disabled-button is additive, not a substitute
metadata:
  type: feedback
---

When an implementation brief or UID spec lists field-level validation strings under "Error —" or in a UID microcopy table (e.g. `Masukkan jumlah yang valid.` / `Pilih akun kas untuk pembayaran ini.`), each string MUST be rendered as an inline hint in the form component alongside the relevant field. Shipping disabled-button logic alone is NOT sufficient — the hints are an independent delivery requirement.

**Pattern:** wrap the field in a `flex flex-col gap-y-1` column div; add a `<span className="text-xs leading-4 font-normal text-red-500" role="alert">` conditioned on the field's validity (e.g. `amount === 0`, `!cashAccount`). Mirror the `fieldErrors.date` rendering pattern already present in the same file for visual consistency. Clear the hint when the field becomes valid (UID §5H clearing rule) — these are validity-gated, not submit-gated.

**Why:** LNS-381 QA catch (Phase 6 FIX 2) — both strings were explicitly in the brief AND the UID microcopy table but shipped absent. Required a fix loop.

**How to apply:** Before reporting a form card as done, scan the brief for every string listed under "Error —", "Hint —", or in the UID microcopy table. For each, confirm there is a `<span>` render site in the form component. If the brief lists N validation strings for a form, the component must have N inline hint render sites. Related: [[verify-computed-state-consumed]], [[spec-copy-verbatim]].
