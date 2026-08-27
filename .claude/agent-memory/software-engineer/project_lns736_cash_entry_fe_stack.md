---
name: lns736_cash_entry_fe_stack
description: LNS-736 shipped the cash-entry (kas masuk/kas keluar) FE domain+data+hooks stack, no UI — key wire-contract decisions for follow-up tickets to build on
metadata:
  type: project
---

LNS-736 delivered the frontend entity, enums, model, repository, service, use cases, and
SWR hooks for cash entries under `src/features/accounting/`, mirroring the journal stack.
No pages/components — LNS-738/739/740/741 build the UI on top of this. Committed on
`feat/cash-entry-domain-data-hooks` (commit 686c68a2).

**Why this is worth remembering:** several wire-contract decisions here are easy to get
backwards from the ticket text, and a follow-up ticket extending this stack should match
them rather than re-derive from the (partially wrong) ticket AC:

- `CASH_ENTRY_ALREADY_CANCELLED` is registered at **409**, not the ticket's stated 422 —
  confirmed against the live `dev-api.loonas.id/openapi.json` cancel endpoint.
- List has no `search` param — only `date_from`/`date_to` (both-or-neither), `direction`,
  `page`, `limit`.
- Create body key is `date`; the response returns it as `entry_date` (Joi-field vs
  column-name asymmetry) — `CashEntryModel.entryDate` is the mapped name.
- `amount` is whole rupiah, never ×/÷100, parsed via `Number(...)` since the (unmounted)
  BE mapper may pass Postgres `NUMERIC` through as a string.
- `cancel` returns the newly created CANCELLATION entry, not the original.
- `category.direction` on a `CashEntryResponse` is unreliable for `status: "cancellation"`
  rows (LNS-762, open) — `CashEntryEntity.isMoneyIn` derives from `this.direction` only,
  never `category.direction`.
- `Idempotency-Key` is required on create and cancel, threaded as a non-optional param
  through use case → repo → service, minted by the caller (not yet built — LNS-740/741
  own minting).
- No cash-entry route is mounted on dev-api yet (LNS-730/731 pending) — this ticket had
  no end-to-end smoke, pure-unit tests only.

See also [[feedback_journal_list_hook_rule10_drift]] for a template deviation made while
building the list hook.
