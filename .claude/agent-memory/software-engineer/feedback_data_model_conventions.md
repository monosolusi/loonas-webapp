---
name: data-model-conventions
description: One model definition per data/models file; conversion method is always toEntity(), never toValue() (PR 246 review)
metadata:
  type: feedback
---

Two data-layer model rules the reviewer enforced on the LNS-738 cash-category stack:

1. **One `implements AbstractModel` class per file.** A nested model (e.g. `CashCategoryAccountModel`) gets its own file, not a co-located definition above its parent (`data/models/cash-category-account-model.ts` split out of `cash-category-model.ts`).
2. **The conversion method is always `toEntity()` — never `toValue()`.** This holds even when the return type is a plain value-object type from `domain/entities/` rather than an Entity class (`CashCategoryAccountModel.toEntity(): CashCategoryAccount` is fine). `fromJson` + `toEntity` is the whole public surface.

**Why:** PR 246 review (franziz): "a single model file can only have a single model definition" and "`toValue()` is not a standard convention, only use `toEntity()`".

**How to apply:** When writing a new model, do not copy `journal.ts` (`JournalPostedBy.toValue()`), `managerial-cost-projection.ts`, or `managerial-cost-allocation-result.ts` — those still carry `toValue()` as pre-existing debt, out of scope for that review. When removing a `toValue()`, grep its consumers: the ripple usually reaches a sibling model's `toEntity()` (here `CashEntryModel.toEntity()` embedded `category.toValue()`, which became a full `CashCategoryEntity` on `CashEntryEntity.category` — matching the dominant entity convention of embedding full related entities, e.g. `CoaMappingLineEntity.account: LedgerAccountEntity`), plus the entity field type and test fixtures that build the narrow shape. Related: [[feedback_model_implements_abstract_model]].
