---
name: journal-reverse-contract-2026-06-25
description: LNS-372 Phase-2 verified — reverse endpoint NOW requires Idempotency-Key (drift since LNS-369), change_reason_category is free string not enum, success is 201
metadata:
  type: project
---

LNS-372 (FE journal detail + reverse). Live OpenAPI re-fetched 2026-06-25 (604,712 bytes); reverse contract has DRIFTED since LNS-369 shipped its reverse service. Verified facts on `POST /accounting/journals/{id}/reverse`:

- **`Idempotency-Key` header is now `required: true`.** When LNS-369 built `JournalServiceImpl.reverse()` it sent NO such header — that path is now a contract gap (400 "missing Idempotency-Key", or 409 `IDEMPOTENCY_KEY_CONFLICT` on dup). Reverse hard-fails until the key threads through `ReverseJournalParams`→repo→service (create path already has the `{ headers: {"Idempotency-Key": key} }` pattern to copy). Reuse the SAME key across the warn→ack resubmit; do NOT regenerate between the 422-needs-ack and the acknowledged resubmit.
- **`change_reason_category` = plain `string`, NO enum, NO length.** FE control is a free-text input, not a Select. (`change_reason_detail` DOES have `minLength:10, maxLength:1000` — validate client-side.)
- **Success status is `201`** (not 200); body is `{data: JournalEntry, warnings: array}` and `JournalWriteResultModel.fromJson` already parses it. `warnings[]` items are typed as bare `object` in the spec (no shape) — FE `WarningEntryModel` (code/severity/account_id/suggested_alternative, WarningSeverity lowercase info/warning/hard) is authoritative.
- Documented error codes: 409 `JOURNAL_REVERSAL_CHAIN_TOO_DEEP`/`PERIOD_CLOSED`; 422 `REVERSAL_POSTING_DATE_INVALID`/`JOURNAL_WARNING_NOT_ACKNOWLEDGED`; 403 feature-not-enabled.
- `get`/`reverse` both `{data}`-wrapped; un-scoped JWT paths (no `{accountId}`) hold in the live spec. `JournalEntity` matches the live `JournalEntry` schema field-for-field.

**Why:** reconfirms the LNS-373/377 lesson ([[project_journal_write_contract_2026_06_15]] companion) that the contract is MUTABLE between tickets — a required header appeared post-LNS-369. **How to apply:** at LNS-372 Phase-3/Phase-7, re-fetch and diff; the Idempotency-Key thread is the one mandatory non-UI change in an otherwise UI+wiring ticket. Recommended v1: OMIT `posting_date` (default server-today). See [[project_two_phase_warn_ack_pattern]] for the arbitrate() warn→ack semantics (reverse usecase already implements it).
