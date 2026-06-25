---
name: lns372-journal-detail-reverse
description: LNS-372 journal detail+reverse FE UI; ticket body STALE on contract — build to shipped LNS-369 infra
metadata:
  type: project
---

LNS-372 (FE journal detail page `/finance/journals/[id]` + reverse action) is UI-only on top of already-shipped LNS-369 infra. **The ticket body is STALE** on the contract — ground on the shipped FE source, not the prose.

**Three stale-ticket corrections (verified against shipped FE source):**
1. Paths are JWT-resolved un-scoped — `GET /accounting/journals/{id}`, `POST /accounting/journals/{id}/reverse`. No `{accountId}` (LNS-366 resolved to option 3). Ticket still shows `/accounts/{accountId}/...`.
2. Reverse body is `change_reason_category` + `change_reason_detail` (+ optional `posting_date`, `acknowledged_warning_codes[]`) — NOT a single `reason`. Confirm dialog needs TWO reason fields.
3. `WarningSeverity` = 3 members `INFO`|`WARNING`|`HARD`. Shipped `ReverseJournalUseCase.arbitrate()` forces acknowledge ONLY for unacknowledged HARD; INFO/WARNING post through (advisory).

**Other ground truth:** `JournalEntity` exposes `postedBy {kind:user|system, label}` (no free actor string), `createdAt` (NO separate `postedAt` — use createdAt), `isReversal`, `isReversedCurrently`, `reversedJournalId`, `supersededById`. **No closed-period flag on the entity** → pre-disable only on isReversedCurrently/isReversal; closed-period is a submit-time graceful-BE-error surface (precedent [[periods-close-infra]] LNS-377 graceful degrade).

**Phase-2 consults RESOLVED (live OpenAPI re-fetched 2026-06-25):**
- `change_reason_category` = FREE STRING (no enum/length) → plain TextInput, not a Select.
- `change_reason_detail` = `minLength:10, maxLength:1000` → client validation gates Confirm (≥10 chars).
- **Idempotency-Key is now REQUIRED on the reverse endpoint** (`required:true`); shipped reverse service sends NONE → reverse hard-fails 400 until fixed. FE-only ~4-file thread (usecase param→repo iface→impl→service header), copy create pattern. Generate one `crypto.randomUUID()` per attempt, REUSE same key across warn→ack resubmit (else lose idempotency on money-move). BE already honors it. This is the ONLY non-UI work item (FR-0, sequence first).
- Reverse success = **201** (not 200).
- Closed-period = submit-time `409 PERIOD_CLOSED`; **already registered in ErrorCodes** (`src/core/resources/server-error.ts:397`) → surfaces registered Bahasa message, not a generic fallback.
- `JournalWarningDialog` NOT reusable (create-provider-bound); only `JournalWarningItem` (props) is → build detail-local reverse dialog composing it. Warn-ack is INLINE (reason fields swap to ack list, one focus trap).
- UI: list entry = ActionMenu "Lihat detail" (coexists w/ expand); `isReversedCurrently`→disabled+helper "Jurnal ini sudah dibalik."; `isReversal`→HIDE button (chip+link). ROUTE_MAP `/finance/journals/[id]`→"Detail Jurnal".
- Sign-offs: D1 defer `posting_date` to v1.1 (omit); D2 free-text category; D3 list-redirect (no LNS-371 change).

**Why:** prevents re-deriving the contract next phase and stops EL/SWE building to stale ticket prose. Relates to [[journal-write-contract]] (LNS-369), [[lns371-manual-journal-page]].
**How to apply:** in Phase 8 verification, check the reverse dialog uses two reason fields, HARD-only ack gate, JWT-resolved paths, and graceful closed-period surface — not the ticket's single-`reason`/account-scoped wording.
