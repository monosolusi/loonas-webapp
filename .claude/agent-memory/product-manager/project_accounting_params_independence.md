---
name: accounting-params-independence
description: Accounting param-independence (3 families, LNS-404) + result-side symmetry (LNS-414): 11 use cases own *UseCaseResult, 6 report hooks re-pointed off repo *Data
metadata:
  type: project
---

The `src/features/accounting/` feature enforces "UseCase params independence" (CLAUDE.md) via **three coexisting param-type families**, each layer owning its own:
- **UseCase layer** → `*UseCaseParams` defined in the use-case file. Canonical reference: `ClosePeriodUseCaseParams` in `domain/usecases/close-period.usecases.ts` (maps to repo params inside `execute()`).
- **Service layer** → `*ServiceParams` defined in `domain/sources/`. Canonical reference: `domain/sources/accounting-period.ts`; its impl `data/sources/accounting-period.ts` imports those `*ServiceParams` (NOT repo params).
- **Repository layer** → `*Params` stay in `domain/repositories/` (legitimate — repos own their input contract; do NOT strip).

Safe because TS is structural: a `*ServiceParams` that is a shape-copy of the repo `*Params` interoperates at the repo-impl → service-impl boundary with no runtime change.

**Result-side symmetry (LNS-414, 2026-06-26):** the param convention above was extended to the OUTPUT side — each accounting list/get use case now owns a `*UseCaseResult` and maps the repo result internally (repos keep their `*Result`/`*Data`; mapping lives inside the use case, NOT repo-impl). Verified scope (re-grepped, ticket body was wrong again — claimed "6 use cases import `*Result`"): **11 use cases** import a repo result/data type = **4 `*Result`** (list-journals/ledger-accounts/ledger-entries/periods) + **7 `*Data`** from `domain/repositories/report.ts` (neraca/laba-rugi/arus-kas/calk/trial-balance/general-ledger/list-trial-balance-lines). Presentation coupling = **6 report hook `.types.ts`** importing `*Data` (NOT `*Result` — that grep was already clean); the 7-vs-6 gap is `get-trial-balance-report` whose hook imports the entity directly. AC grep invariant must target `*Result`|`*Data` (not just `*Result`). Pure FE, no BE/UI change; EL the only consult.

**Why:** LNS-404 (2026-06-26) was a pure-type cleanup removing repo `*Params` imports from `domain/usecases/` + `data/sources/`. Its ticket body file list was inaccurate: listed `data/sources/accounting-period.ts` (already clean) and MISSED `data/sources/{ledger-account,coa-mapping}.ts` + their `domain/sources/` counterparts. The real violator set spanned 6 use cases + 3 domain/sources + 3 data/sources. Re-grepping against source (not trusting the body) caught it — same discipline as [[stale-ticket-reconcile-blocker]].

**How to apply:** When scoping any accounting layer/refactor ticket whose AC is grep-based, re-grep the violator set yourself before the PRD; treat the enumerated file list as a starting hypothesis. The data/sources cleanup requires the domain/sources enabling step (its interface must define `*ServiceParams`) — they cannot be fixed independently.
