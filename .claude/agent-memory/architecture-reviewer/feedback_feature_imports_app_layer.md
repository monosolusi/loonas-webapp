---
name: feature-imports-app-layer
description: Feature presentation components must not import from app/ layer — SummaryCard in app/finance/_components is a recurring cross-contamination risk
metadata:
  type: feedback
---

In LNS-375, `buku-besar-viewer.tsx` (a feature presentation component under `features/accounting/presentations/`) imported `SummaryCard` from `@/app/(authenticated)/finance/_components/summary-card`. This is a Clean Architecture blocker: the feature layer must never import from the app layer.

`SummaryCard` lives in the app layer because it was built as a page-specific component. When it needs to be reused by feature-layer components, it must first be promoted to `core/presentations/components/`.

**Why:** Feature layer → app layer creates an inversion dependency that makes features non-portable and breaks the Clean Architecture layering contract (domain < data < presentations < app).

**How to apply:** When reviewing feature files under `src/features/`, flag any import whose path starts with `@/app/`. The only valid cross-boundary imports from features are: `@/core/` (upward to shared infrastructure). App-layer components that are needed by features must be promoted to core first.
