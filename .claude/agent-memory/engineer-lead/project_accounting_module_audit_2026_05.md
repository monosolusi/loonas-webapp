---
name: accounting-module-audit-2026-05
description: Snapshot of accounting feature module state when Plan B+ rollout began, including pre-existing scaffolding that predated the v1 contract
metadata:
  type: project
---

As of 2026-05-12, `src/features/accounting/` already contained substantial scaffolding (entities, models, services, repositories, use cases, hooks) for CoA mappings, ledger accounts, journals, ledger entries, and account balances — plus mutation chains (`POST/PUT/DELETE /accounting/coa-mappings`) and a `/settings/coa-mappings` page with create/edit/delete dialogs. There were also `/finance/journals` and `/finance/ledger` pages.

The "Plan B+ Accounting Bootstrap" v1 BE rollout only exposes 6 endpoints (GET/PATCH settings, GET mappings, GET entity types, POST pph-final-settle, POST expenses-payment) and does NOT include the mapping mutation endpoints the existing FE code targets.

**Why:** The prior scaffolding was built against an earlier design. Important consequences for any new accounting plan: (1) the FE's `CoaMappingLineModel.fromJson` assumes a fully hydrated `account` field, which crashes on the new stub `{id}` / null shapes; (2) `ListCoaMappingsUseCase` returns `PaginatedData<T>` but the new contract is an unpaginated array; (3) the mutation hooks/dialogs need to be feature-gated or removed pending BE confirmation; (4) `CoaMappingEntityTypeEntity` was missing `category`, `pattern`, `requiresAccountRole` fields.

**How to apply:** When picking up new accounting work, first verify what's already scaffolded under `src/features/accounting/` and whether it aligns with the current BE contract — do not assume green-field. The `accounting` feature flag on the account entity ([[feature-flag-mechanism]]) is the canonical gate. See the original Plan B+ plan in the PR for `features/accounting-bootstrap` branch for the reconciliation work needed.
