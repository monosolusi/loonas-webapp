---
name: project-lns371-manual-journal-entry
description: LNS-371 Manual Journal Entry create page — layout, warning dialog severity presentation, discard guard deferral, CTA placement, degenerate-zero block
metadata:
  type: project
---

LNS-371: FE Manual Journal Entry create page at `/finance/journals/new`.

**Key design decisions:**
- Route: `/finance/journals/new` as a standalone page (not a dialog) — line editor needs vertical room.
- Layout: `DetailPageHeader` (back → `/finance/journals`, title "Jurnal Baru", action = `PrimaryButton` "Simpan Jurnal") + two `SectionCard`s stacked vertically: "Detail Jurnal" (date + memo, 2-col grid), "Baris Jurnal" (JournalLineEditor full-width).
- No sticky footer bar — Submit lives in the header action slot, consistent with productions/create pattern.
- Balanced-zero degenerate block: Submit must NOT enable when totalDebit === 0 AND totalCredit === 0. Guard: `isBalanced && totalDebit > 0` is the true enabled condition.
- Warning dialog: `LoonasDialog width="md"` (not ConfirmationDialog — needs per-item severity rendering). Three visual tiers:
  - `info` → primary-50 bg, primary-400 text, `InformationCircleIcon`
  - `warning` → warning-50 bg, warning-400 text, `ExclamationTriangleIcon`
  - `hard` → error-50 bg, error-400 text, `ExclamationCircleIcon`
  Each item is a card block inside a scrollable list. `suggestedAlternative` renders as a sub-line in charcoal below the main message.
- Warning dialog footer: `SecondaryButton outlined` "Batal" (Esc = cancel), `PrimaryButton` "Tetap Posting" — NOT DangerButton (action is not destructive; warnings are guidance, not blockers).
- Hard warnings: header callout strip "Harap perhatikan peringatan di bawah sebelum melanjutkan" when any `hard` severity item is present.
- Success flow: toast "Jurnal berhasil diposting" → `router.push("/finance/journals")` → SWR revalidate LIST_JOURNALS key.
- Discard guard: DEFERRED to v1.1. No `beforeunload` hook in v1. Back button navigates directly.
- In-flight state: `PrimaryButton loading={true} loadingLabel="Menyimpan…"` in header; form fields `disabled={true}`; warning dialog Confirm button `loading={true}` during resubmit.
- Network failure (non-422): toast error, form re-enabled, no data loss.
- 422 validation errors: field-level via error prop on TextInput/DatePickerInput; form-level via JournalLineErrorBlock pattern (error-50 bg, ExclamationCircleIcon, error-400 text).
- ROUTE_MAP entries: `/finance/journals/new` → "Jurnal Baru" AND `/finance/journals` → "Jurnal Umum" (the list page was missing its entry — latent Dashboard-fallback fixed in this ticket).
- `Jurnal Baru` CTA on list page: `PrimaryButton` added to the right side of the toolbar (top-right, between search and list table).

**Why:** Line editor is full-width and multi-row; a full page gives it the vertical breathing room it needs. The productions/create pattern (DetailPageHeader + SectionCards + header-action submit) is the established vocabulary for create flows.

**How to apply:** When building the warning dialog, import `LoonasDialog + DialogFooter` directly (not `ConfirmationDialog`). Severity coloring must follow the three-tier spec above. Never use DangerButton for "Tetap Posting".

Related: [[project-journal-line-editor-spec]], [[design-language-conventions]], [[project-accounting-surfaces-ia]]
