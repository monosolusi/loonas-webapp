---
name: data-model-one-per-file
description: PR 246 (franziz) convention — one Model class per file in data/models/, nested models get their own file; entity-backed nested models convert via toEntity(), not toValue()
metadata:
  type: feedback
---

Convention enforced by human reviewer franziz on PR 246 (LNS-738, commit 9bbae2c0, 2026-08-30):

1. **One `*Model` class per file** under `data/models/`. A nested model (e.g. `CashCategoryAccountModel`) gets its own file, imported by its parent model.
2. **A model whose output feeds an entity field converts via `toEntity()` only** — no parallel `toValue()`. `CashCategoryModel.toValue()` and `CashCategoryAccountModel.toValue()` were both deleted on the reviewer's request; `CashEntryModel.toEntity()` now embeds `this.category.toEntity()`.

**Why:** the narrow `{id,name,direction}` shape forced a second conversion method whose field list could drift from `toEntity()`; widening `CashEntryEntity.category` to the full `CashCategoryEntity` collapsed the two paths into one.

**How to apply:** flag a two-class model file or a duplicated `toValue()`/`toEntity()` pair on an entity-backed model. Do NOT flag the pre-existing `toValue()` on genuine value-object models (`journal.ts` `JournalPostedBy`, `managerial-cost-projection.ts` `ManagerialPeriod`) — different shape, untouched files. Note `CashCategoryAccountModel.toEntity()` returns the plain-object type `CashCategoryAccount` (not an AbstractEntity class) — that follows the reviewer's explicit ask, so it is not a violation.

When reviewing a change that **widens** an entity field from a narrow value type to a full entity (sibling precedents: `CoaMappingLineEntity.account: LedgerAccountEntity`, `IncomingInvoiceEntity.receiver: PartnerEntity`), verify behavior preservation by (a) grepping every read of the widened field, (b) confirming the previously-visible fields flow from the same model fields as before, and (c) checking nothing compared/spread/serialized the old plain-object shape. See [[lns762-cash-entry-direction-caveat]].
