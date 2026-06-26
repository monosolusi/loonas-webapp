---
name: accounting-params-independence
description: Accounting feature has THREE coexisting param-type families (UseCaseParams/ServiceParams/repo Params); canonical clean references + LNS-404 enforced it
metadata:
  type: project
---

The `src/features/accounting/` feature enforces "UseCase params independence" (CLAUDE.md) via **three coexisting param-type families**, each layer owning its own:
- **UseCase layer** → `*UseCaseParams` defined in the use-case file. Canonical reference: `ClosePeriodUseCaseParams` in `domain/usecases/close-period.usecases.ts` (maps to repo params inside `execute()`).
- **Service layer** → `*ServiceParams` defined in `domain/sources/`. Canonical reference: `domain/sources/accounting-period.ts`; its impl `data/sources/accounting-period.ts` imports those `*ServiceParams` (NOT repo params).
- **Repository layer** → `*Params` stay in `domain/repositories/` (legitimate — repos own their input contract; do NOT strip).

Safe because TS is structural: a `*ServiceParams` that is a shape-copy of the repo `*Params` interoperates at the repo-impl → service-impl boundary with no runtime change. `*Result` (repo return shapes) are NOT params — out of scope of this convention.

**Why:** LNS-404 (2026-06-26) was a pure-type cleanup removing repo `*Params` imports from `domain/usecases/` + `data/sources/`. Its ticket body file list was inaccurate: listed `data/sources/accounting-period.ts` (already clean) and MISSED `data/sources/{ledger-account,coa-mapping}.ts` + their `domain/sources/` counterparts. The real violator set spanned 6 use cases + 3 domain/sources + 3 data/sources. Re-grepping against source (not trusting the body) caught it — same discipline as [[stale-ticket-reconcile-blocker]].

**How to apply:** When scoping any accounting layer/refactor ticket whose AC is grep-based, re-grep the violator set yourself before the PRD; treat the enumerated file list as a starting hypothesis. The data/sources cleanup requires the domain/sources enabling step (its interface must define `*ServiceParams`) — they cannot be fixed independently.
