---
name: project-periods-page
description: LNS-377 Accounting Periods page — list, close, reopen design decisions and copy
metadata:
  type: project
---

Accounting Periods page at `/finance/periods` ("Periode Akuntansi") — LNS-377.

Key design decisions:
- StatusChip: Terbuka → `neutral` variant; Terkunci → `success` variant (settled/completed register, not alarming)
- Capability-absent: hide ActionMenu option (and trigger if no options remain) — never disable+tooltip
- Close and reopen dialogs: `LoonasDialog width="sm"` + `DialogFooter` directly (not `ConfirmationDialog` — that base does not support a form field between description and footer)
- Reason field: `TextAreaInput` with `required` + asterisk; advisory description below
- PPh-Final 422 error + pre-deadline advisory both render inline below the reason field, above the footer
- Advisory is non-blocking; submit button stays enabled while advisory is shown
- Idempotency-Key generated on dialog open via `crypto.randomUUID()`, sent as header (name TBD — BE-2)
- Reopen: hidden for non-admins (client-side Clerk role check until BE capability flag confirmed — BE-4)
- `TextAreaInput` (not deprecated `TextArea`) for the reason field
- ROUTE_MAP entry needed: `/finance/periods` → `{ title: "Periode Akuntansi" }`
- Deadline formatting: `setor_deadline` ISO Asia/Jakarta → `DD MMMM YYYY, HH:mm WIB` via Luxon

**Why:** Locking a period is a books-close event with audit consequences; dialog must communicate permanence and collect a mandatory audit trail reason.

**How to apply:** When extending or changing the periods surface, preserve the reason-field requirement, the hiding pattern for capability-absent actions, and the inline error placement below the field.

Related: [[design-language-conventions]], [[project-accounting-surfaces-ia]]
