---
name: journal-write-contract
description: Live BE contract for journal create/get/reverse (LNS-369) — JWT-resolved /accounting/journals paths, request bodies, {data}-wrapped responses, warnings shape
metadata:
  type: project
---

Journal **write** contract (create/single-get/reverse), confirmed against the live OpenAPI spec (`dev-api.loonas.id/openapi.json`) 2026-06-15 for LNS-369. The journal LIST layer already shipped; this is the write side.

**Why:** LNS-369's own ticket body was STALE (written before [[jwt-only-tenant-resolution]] / LNS-382 shipped) — it claimed `/accounts/{accountId}/journals`, a `date`/`reference_type`/`reference_id` create body, a single `reason` reverse field, and a "bare (no {data})" single-get. ALL FOUR were wrong vs the live spec. Build on the spec, not the ticket text.

**How to apply:** when scoping any journal write/reverse/detail FE work (LNS-371 manual-entry, LNS-372 detail+reverse), use these facts:

Paths (NO account/tenant id — JWT-only, per [[jwt-only-tenant-resolution]]):
- POST `/accounting/journals` (create)
- GET `/accounting/journals/{id}` (single-get; `{id}` = journal id, not tenant)
- POST `/accounting/journals/{id}/reverse` (reverse)
- (GET list `/accounting/journals` already built; PUT `/{id}` update exists but out of LNS-369 scope)

Create request body: `posting_date*` (ISO date-time), `memo*`, `lines*[]` (`{account_id, debit, credit}` integers, exactly one positive per line), `acknowledged_warning_codes[]?`. NO `date`/`reference_type`/`reference_id` in request (those are response-only).

Reverse request body: `change_reason_category*` (string), `change_reason_detail*` (string), `posting_date?`, `acknowledged_warning_codes[]?`. NO single `reason` field — split into category + detail.

Responses: create/reverse → `{ data: JournalEntry, warnings: WarningEntry[] }` (201). Single-get → `{ data: JournalEntry }` (200, IS wrapped — unwrap `result.data`).

JournalEntry audit/actor fields (beyond the list-layer model): `posted_by` (object|null), `is_reversal` (bool), `reversed_journal_id` (string|null), `superseded_by_id` (string|null), `is_reversed_currently` (bool), plus `reference_type`/`reference_id` (response-only). JournalLine carries `account_code`/`account_name`/line `date`/`memo`.

warnings[] item shape (NOT in live spec — spec leaves it a bare object; sourced from LNS-382 read-verified `WarningEntryDto` in loonas-api, 2026-06-14): `code: string`, `severity: "info"|"warning"|"hard"` (3-member closed set), `account_id: string|null`, `suggested_alternative: string|null`. Open BE confirm: is this still accurate + will BE publish item-shape to the spec.

Two-phase warn→acknowledge→resubmit: first submit w/o codes → if `warnings[]` non-empty, return needs-acknowledge (NO silent post); resubmit echoing accepted `code`s in `acknowledged_warning_codes[]` → posts. Partial-acknowledge → BE may re-warn on remaining; FE loop must tolerate. Applies to BOTH create and reverse.

Idempotency (resolves the old BE-2 question): the live spec NOW declares an `Idempotency-Key` **header** on `POST /accounting/journals` — BE is ready for it. The LNS-369 infra ticket correctly does NOT send it (deferred). Wire it as the double-submit guard in the consuming journal-form UI ticket (LNS-371). Confirmed by EL at LNS-369 completion 2026-06-15.

LNS-369 status: shipped + EL-signed-off 2026-06-15 (domain/data infra: usecases, repo+source create/get/reverse, JournalEntry audit fields + WarningEntryModel, hooks, two-phase result). Contract above re-validated against live spec at completion, ZERO drift — treat as authoritative for LNS-371/372. Arch convention applied: mutation hooks use hook-local literal SWR keys, list-revalidation deferred to the caller (per `create-hook-mutation` skill) — so the consuming UI ticket owns triggering the journals-list revalidation after create/reverse.
