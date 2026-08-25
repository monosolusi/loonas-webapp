---
name: project_lns676_overhead_accounts
description: LNS-676 overhead-account-selection screen — key implementation decisions and reusable patterns
metadata:
  type: project
---

Shipped 2026-08-25 on branch `feat/overhead-account-selection` (off `release/fix-hpp`), PR not yet
opened by this session. `/accounting/overhead-accounts` — full-replace merchant selection of which
CoA accounts count as production overhead.

**Why:** BE contract (`GET`/`PUT /accounting/overhead-accounts`) was merged into
`release/fix-hpp` on `monosolusi/loonas-api` but deliberately absent from `dev-api.loonas.id/openapi.json`
(dev-api deploys from trunk). Confirmed live via the merged OpenAPI on that release branch, not
dev-api — the usual "verify against deployed openapi.json" rule doesn't apply when the ticket names
a specific non-trunk release branch as the source of truth.

**How to apply / reusable patterns:**
- **Trivial-passthrough use case has no invented Result wrapper.** When a use case does ONE repo
  call with no transformation (no pagination loop, no shape change), mirror
  `ListCoaMappingEntityTypesUseCase`/`UpdateCoaMappingUseCase`: `implements UseCase<DataState<Entity[]>>`
  directly, private method `return this.repo.list(session);` inline — no `{ selections: [...] }`
  wrapper type. Reserve the wrapper-result shape (`ListAllLedgerAccountsUseCaseResult`) for use
  cases that actually do work (e.g. paging through all accounts). Over-wrapping here would have
  been unnecessary abstraction for a 1:1 repo passthrough.
- **Provider-guarantee `loading` prop gates on loading only, NOT on fetch error, when the brief
  also wants an in-card error state.** `TaxPostureProvider`'s pattern (fall through to
  `loadingIndicator` on any non-FORBIDDEN error) is wrong for a page that also needs a
  `{noun}-error.tsx` in-card retry surface — that requires children (header, picker, etc.) to
  render even when the GET failed, with `error: ServerError | null` exposed for ONE consuming
  component to react to. Resolution: provider's early-return only checks `listResult.loading`;
  `savedAccounts`/`bufferAccounts` default to `[]` on error (never null) so the "children get
  non-nullable data" guarantee still holds, and the SectionCard-owning component
  (`overhead-accounts-card.tsx`) early-returns the WHOLE card as `<OverheadAccountsError/>` when
  `error` is set — mirroring `dashboard-low-stock-card.tsx`'s sequential if-return
  (loading→error→empty→list) shape, just with the "loading" leg handled one level up by the
  provider instead.
- **Rejection banner, not toast, for the save-time 422.** `resolveOverheadRejection()` returns a
  `{kind: "not-selectable", accounts}` | `{kind: "generic", message}` union consumed by ONE
  dismissible banner component; the save handler deliberately does not also toast on failure
  (toast is reserved for the success path) to avoid double-notifying for the same rejection the
  banner already names in detail.
- **Confirm-before-clearing gate is a pure predicate, not a UI check**:
  `isClearingAllAccounts(buffer, saved) = saved.length > 0 && buffer.length === 0` — false on
  first load (saved already empty) so the empty-state screen never shows a spurious confirm
  dialog, only a genuine non-empty→empty transition does.
- Related: [[feedback_swr_error_needs_data_gate]], [[feedback_use_case_owns_business_decisions]].
