---
name: spec-copy-verbatim
description: When the spec/brief gives explicit user-facing copy (button labels, toasts, errors, dialog text), ship it verbatim — if a different word seems better, flag the proposed deviation rather than silently substituting
metadata:
  type: feedback
---

**Rule:** Treat quoted user-facing strings in the plan/brief as literals, not suggestions. Ship them exactly as written. If you believe a different word reads better, surface it as a flagged deviation in your completion report and let the ruling come back — do not silently substitute.

**Why:** LNS-371 — the spec gave the success toast as "Jurnal berhasil diposting," but I shipped "Jurnal berhasil disimpan" (to match the "Simpan Jurnal" button). The instinct was defensible, but the silent substitution from explicit spec copy forced an extra PM copy ruling (which landed back on "diposting") and a follow-up change.

**How to apply:** At report time, diff the brief's quoted strings (button labels, toast messages, error text, dialog copy) against what you actually shipped; ship them verbatim, and list any intentional deviation explicitly with your reasoning so it can be ruled on up front.
