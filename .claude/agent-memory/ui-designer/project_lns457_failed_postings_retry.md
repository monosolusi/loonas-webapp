---
name: project-lns457-failed-postings-retry
description: LNS-457 close-period 422 PERIOD_HAS_FAILED_POSTINGS design decisions — retry-via-existing-button, escalation-hint threshold, copy, contrast
metadata:
  type: project
---

LNS-457 adds a new close-period 422 code `PERIOD_HAS_FAILED_POSTINGS`, surfaced inline in `close-period-dialog.tsx` and `fixed-cost-close-period-dialog.tsx` — same warning-callout slot as the existing `PERIOD_NOT_DRAINED` / `PPH_FINAL_NOT_POSTED` blocks (`border-warning-400 bg-warning-50`, `text-warning-500`, no icon, no heading — flat single paragraph).

Key decisions:
- **Retry = the existing "Tutup periode" `PrimaryButton`, re-clicked.** It already re-invokes `handleClosePeriod` with a fresh `crypto.randomUUID()` idempotency key on every call (generated per-submit, not per dialog-open). No new/separate "Coba lagi" button — preserves the One Signal Rule and sibling-state consistency (the two existing 422 blocks never got a distinct retry button either; the instruction text itself ends "...coba lagi" and the still-enabled button IS the affordance).
- **Escalation hint** ("Masih gagal? Tim Loonas siap membantu." + a WhatsApp link reusing `AccumulatedDeficitBlock`'s `LOONAS_WHATSAPP_URL` + disabled-degrade pattern) appears only on the **2nd+ CONSECUTIVE** occurrence of this same error within the current dialog-open session — a local attempts counter, reset on dialog open/dismiss/success/any-other-error-code. Not shown on the first failure (keeps tone calm/fixable per PRODUCT.md; avoids "crying wolf" — NN/g: escalate recovery help after a repeat failure, not the first attempt).
- **Count interpolation**: "Ada {N} transaksi..." only when the BE sends a valid numeric count > 0; falls back to the count-less copy ("Ada transaksi...") for missing/0/non-numeric — never "0 transaksi" or "undefined".
- Callout stays visually **identical** to the sibling 422 blocks — no color escalation to error/red, since PRD frames this as a fixable/retriable state, not the user's fault.
- Verified contrast (real hex from `globals.css`): `text-warning-500` (#B54708) on `bg-warning-50` (#FFFCF5) ≈ 5.30:1 (passes AA body text 4.5:1); `border-warning-400` (#DC6803) on same bg ≈ 3.40:1 (passes the 3:1 non-text bar).
- `role="status" aria-live="polite"` on the wrapping div (matches `period-advisory.tsx` precedent) — NOT `role="alert" aria-live="assertive"` + autofocus (that tier is reserved for genuine dead-ends, e.g. `AccumulatedDeficitBlock`). This state is retriable, so it shouldn't steal focus from the button the user is about to click again.

**Why:** Matches the existing dialog-scoped 422 pattern exactly (calm, no new visual vocabulary) — breadth-without-clutter over inventing a new error-state affordance for one new code.

**How to apply:** When extending this dialog's error states further, keep new 422 codes on the same flat warning-callout treatment unless the state is truly non-recoverable — reserve the assertive/autofocus/error-toned tier for genuine dead-ends only.

Related: [[project_periods_page]], [[project_error_details_bag_mechanism]], [[feedback_inline_advisory_precedent]]
