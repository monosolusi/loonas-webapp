---
name: project-periods-page
description: LNS-377 Accounting Periods page — list, close, reopen design decisions and copy
metadata:
  type: project
---

Accounting Periods page at `/finance/periods` ("Periode Akuntansi") — LNS-377.

Key design decisions:
- StatusChip: Terbuka → `neutral` variant; Terkunci → `success` variant (settled/completed register, not alarming). Verified contrast: success-500 (#067647) on success-50 (#F6FEF9) ≈ 7.3:1. neutral-400 (#1B1B1B) on neutral-100 (#D9DADA) ≈ 12.7:1. Both pass AA.
- Capability-absent: hide ActionMenu option (and trigger if no options remain) — never disable+tooltip. Terkunci + non-admin → render null.
- Close and reopen dialogs: `LoonasDialog width="sm"` + `DialogFooter` directly (not `ConfirmationDialog` — that base does not support a form field between description and footer)
- Reason field: `TextAreaInput` with `required` + asterisk; `description` prop for audit trail note. Submit button disabled while reason is empty/whitespace-only (provider-level guard, not HTML required).
- PPh-Final 422 inline block: `bg-warning-50 border border-warning-400` warning callout with structured bullet list (setor_deadline, expected_account_code, period_dpp, tenant_regime). Body text `text-warning-500`, heading `text-warning-400` (bold qualifies as large text, 3:1 bar). Block does NOT disable submit (user may have fixed externally and wants to retry).
- Period-not-drained 422: same warning callout pattern, different copy.
- 409 already-closed / not-closed: info callout (`bg-primary-50 border-primary-300`).
- Unknown error: error palette (`bg-error-50 border-error-300`).
- Close confirm button: `PrimaryButton` (Lunas Blue) — closing is confident/positive, NOT `DangerButton` (red).
- Reopen confirm button: `PrimaryButton` — same rationale.
- Idempotency-Key generated on dialog open via `crypto.randomUUID()`, stored in state, regenerated on re-open. Header name TBD — BE-2.
- Reopen: hidden for non-admins (Clerk `org:admin` check until BE capability flag confirmed — EL-3).
- `TextAreaInput` (not deprecated `TextArea`) for the reason field.
- ROUTE_MAP entry needed: `/finance/periods` → `{ title: "Periode Akuntansi" }`.
- Nav item: add `NavigationChildItem href="/finance/periods" label="Periode Akuntansi"` after Biaya Tetap, before the `<hr>` divider. Add `"/finance/periods"` to matchPrefixes.
- Deadline formatting: `setor_deadline` ISO → Luxon `DateTime.fromISO(v, { zone: "Asia/Jakarta" }).toFormat("dd MMMM yyyy, HH:mm")` + `" WIB"`.
- `allowDismiss={false}` on dialog while `isSubmitting` — data integrity guard.
- Success toast fires AFTER dialog closes.
- Table: `TableToolbar` + `TableHeader` (6 columns: PERIODE, JENIS, DIBUKA, DITUTUP, STATUS, actions) + `TableContainer` + `TablePagination`. NOT `InvoiceTableShell`.
- Filter toolbar: two `SelectInput noLabel` (status: Terbuka/Terkunci; jenis: Bulanan/Tahunan), each `w-[180px]`.
- EL open questions: EL-1 (3rd enum state?), EL-2 (Tahunan closeable?), EL-3 (admin capability signal), EL-5 (close gated by capability?), EL-6 (tenant_regime enum), EL-7 (period-not-drained error code), EL-8 (TextAreaInput SR association), EL-9 (grid ARIA).

**Why:** Locking a period is a books-close event with audit consequences; dialog must communicate permanence and collect a mandatory audit trail reason. The positive/success chip and PrimaryButton confirm-action keep tone calm and confident, not alarming.

**How to apply:** When extending or changing the periods surface, preserve the reason-field requirement, the hiding pattern for capability-absent actions, the inline error placement below the field, and the PrimaryButton (not DangerButton) for confirm.

Related: [[design-language-conventions]], [[project-accounting-surfaces-ia]]
