---
name: lns738-cash-category-stack
description: LNS-738 cash-category + cash-entry-settings FE stack — hook-level revalidateSWRKey precedent, direction-only list filter (spec has no page/limit), 3-field account value object
metadata:
  type: project
---

LNS-738 (committed afde4ad2 on `feat/cash-category-settings-stack`, 2026-08-30) established three things future tickets on this resource family must know:

1. **Mutation hooks now carry their own cache invalidation.** Codebase convention before this was app-layer-only (`revalidateSWRKey` was called from `_providers/` and dialogs, never from `presentations/hooks/`). The LNS-738 brief explicitly mandated hooks invalidate after success because no UI exists yet, so the four mutation hooks call it **fire-and-forget**: `void revalidateSWRKey(KEY).catch(() => {})` inside the fetcher, *after* the use case succeeds. Never `await` it there — it rethrows on a failed refetch and would report a successful write as failed. Decide deliberately whether the next mutation hook mirrors this or reverts to app-layer; do not mix the two shapes silently on one feature.

2. **`GET /accounting/cash-categories` has no `page`/`limit`/`search` param** in the live spec — only `direction` (`in`/`out`) — even though the response carries a `meta` envelope. So `ListCashCategoriesParams` is direction-only and the list hook surfaces `meta` without being able to paginate server-side. If the downstream category-management page needs paging, that is a BE contract change first.

3. **The category's inline `account` object is `{id, code, name}` — no `type`** (the Linear AC claimed `type`; the live spec does not declare it). It is modeled as a dedicated `CashCategoryAccountModel` value object + `CashCategoryAccount` entity type, **not** a partial `LedgerAccountModel` (that would mint defaulted balance/type fields the resource never sends). Direction→account-type eligibility is resolved by the advisory helper `domain/helpers/cash-category-eligibility.ts` (`eligibleAccountTypesFor`, pure unit, see [[feedback-usecase-private-methods-plain-return]] for the sibling use-case rule); the server owns the real gate (422 `CASH_CATEGORY_DIRECTION_MISMATCH` on category write, `CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH` on settings PATCH).
