---
name: project-f10-unavailable-option-copy
description: Loonas copy stance for unavailable features (fact not promise) and the only real support channel in the codebase
metadata:
  type: project
---

For a feature/option that exists in the UI but is not yet available, Loonas copy states a
**present fact, never a delivery promise**: "Belum tersedia" / "Belum didukung", never
"Segera hadir". In-repo precedent: `checkout-step-method-body-list.tsx` ("Belum didukung"),
`checkout-step-unsupported.tsx`, `server-error.ts` ("Fitur ini belum tersedia untuk akun Anda").

**Why:** PRODUCT.md's brand is trustworthy/precise/calm. A missed "segera" converts a small
limitation into a broken commitment — the exact trust this fintech is built on. (Decided on QA
finding F10, `/onboarding/account` step 3 WNA option, 2026-08-17.)

**Support channels — verify before referencing:**
- `LOONAS_WHATSAPP_URL` (`src/core/utilities/contact.ts`) is `""` with a TODO. **Unusable.**
  Existing callers already branch on the empty string and degrade to plain text.
- `mailto:support@loonas.com` (in `kyc-summary-content.tsx`) is the only real channel.
- Do **not** offer a support link for something support cannot actually resolve — that
  manufactures a dead end plus support load with no outcome. Absence of a link can be the
  correct design decision; say so explicitly in the spec so SWE doesn't "fix" it.

**How to apply:** whenever specifying an unavailable/blocked/coming-soon affordance, or any copy
that wants to point the user at help. Also relevant: WNA (foreign nationals) cannot register at
all today — the business flow is equally gated (it asks for "KTP Direksi"), so there is no
alternative path to suggest. See [[disabled-state-opacity-fails-aa]].
