---
name: journal-write-contract-2026-06-15
description: Verified live BE contract for journal create/get/reverse (LNS-369) — paths, field names, {data}/{data,warnings} wrapping, audit fields, two-phase warn→ack
metadata:
  type: project
---

Journal WRITE contract, verified fresh vs live OpenAPI 2026-06-15 (LNS-369; canonicalized from resolved LNS-366→LNS-382/384). The ticket body was STALE; corrections below are live-spec-confirmed.

**Endpoints (NO `{accountId}` — JWT-only tenancy):**
- `POST /accounting/journals` (create) — body `{posting_date, memo, lines[], acknowledged_warning_codes[]?}`; resp `201 {data: JournalEntry, warnings[]}`
- `GET /accounting/journals/{id}` (single-get) — resp `200 {data: JournalEntry}` (IS {data}-wrapped; ticket's "bare" claim wrong)
- `POST /accounting/journals/{id}/reverse` — body `{change_reason_category, change_reason_detail, posting_date?, acknowledged_warning_codes[]?}`; resp `201 {data, warnings[]}`
- (PUT `/accounting/journals/{id}` updateJournal = supersede+audit; exists but NOT in LNS-369)

**Create line item (request):** `{account_id, debit:int, credit:int}` — exactly one of debit/credit positive.

**JournalEntry RESPONSE shape:** `date` (NOT posting_date — posting_date is request-only), `memo`, `reference_type`, `reference_id` (still present in RESPONSE; only the create BODY drops them), `lines[]`, plus NEW audit fields: `posted_by: {kind:"user"|"system", label} | null`, `is_reversal:bool`, `reversed_journal_id`, `superseded_by_id`, `is_reversed_currently:bool`, `created_at`. JournalLine resp adds `date`+`memo` vs the request line.

**Open BE nuances (assumptions, not blockers):**
- `change_reason_category` has NO enum in live spec (free string "Audit change reason category"). Treat opaque until BE confirms.
- `warnings[]` item is bare `{type:object}` in public spec → WarningEntryDto unpublished (BE-1). Model to PM shape: `{code, severity:"info"|"warning"|"hard", account_id|null, suggested_alternative|null}`.
- Both create+reverse return 201 even with warnings. ASSUMPTION: BE does NOT commit when a hard warning is unacknowledged (per LNS-382). If BE actually commits-on-201, resubmit-with-acks double-posts — worth BE confirmation.
- Phase-7 re-fetch (2026-06-15 18:09): spec now declares an `Idempotency-Key` header on `POST /accounting/journals` — BE is ready for it. This infra ticket correctly does NOT send it; wire it as the double-submit guard in the consuming journal-form UI ticket (LNS-371) per BE-2.

**Why:** LNS-369 is FE infra-only foundation; the page/form UI is a later ticket.
**How to apply:** Reuse for any future journal write UI plan. Existing read-layer JournalModel/Entity must be EXTENDED with the audit fields (one shared model, don't fork). Re-fetch live spec before relying on this — BE ships continuously.
