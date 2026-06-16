---
name: project-report-shell-contract
description: LNS-365 shipped the financial-report shell AND the full module-layer plumbing for all 6 report viewers; viewers only add typed shape + bespoke body + hub
metadata:
  type: project
---

LNS-365 ("FE foundation: financial report shell", PR#71, Done 2026-06-15) shipped much more than just the shell chrome. As of 2026-06-15 the following already exist under `src/features/accounting/`:

- **Shell chrome**: `presentations/components/reports/report-shell.tsx` (`ReportShell`) + split state components (loading/empty/error/success), `report-controls-row.tsx`, `report-imbalance-banner.tsx`. Props: `ReportShellProps` in `presentations/types/report-shell.types.ts` — `dateMode: "as-of" | "range"`, `imbalance: NormalizedImbalance | null`, `state: loading|empty|error|success`, `onRetry`, `children`, plus slots `headerAction?` (export button) and `tabStrip?` (hub switcher).
- **Full module-layer plumbing for ALL SIX reports** (neraca, laba-rugi, arus-kas, trial-balance, general-ledger, calk): usecases (`domain/usecases/get-*-report.usecases.ts`), repo interface+impl (`domain/repositories/report.ts`, `data/repositories/report.ts`), service interface+impl (`domain/sources/report.ts`, `data/sources/report.ts`), hooks (`presentations/hooks/use-get-*-report.ts` + `.types.ts`), and SWR keys (`presentations/constants/swr-keys.ts` — `GET_NERACA_REPORT` etc.).
- **Unwrap helper**: `presentations/helpers/unwrap-report-response.ts` — `unwrapReportResponse<T>` ({data}/{data,meta}) + `mapImbalance` (RawImbalance `{is_balanced?, delta?}` → NormalizedImbalance `{isBalanced, delta}`).

CRITICAL for scoping per-viewer tickets: the report response data is typed as `{ data: Record<string, any> }` (e.g. `NeracaReportData`) — the shell deliberately left the per-statement section/totals/meta shape UNTYPED (passthrough). So a viewer ticket's "module layer" work is NOT re-scaffolding plumbing — it is (a) defining the typed statement shape (model/entity), and (b) building the bespoke viewer body + any hub. Do not let EL re-create the usecase/repo/source/hook/SWR key; they exist.

Service contract confirmed from source (not memory): `getNeraca` → `GET /accounting/reports/neraca`, searchParams `as_of` (required) + `compare_to` (optional), JWT-resolved tenant (no account id, per [[project-jwt-only-tenant-resolution]]), returns `{ data }`. Laba Rugi is POST-with-body (`/accounting/reports/laba-rugi`).

**Why:** prevents the LNS-230-class scope bug (re-scoping already-shipped work) and grounds viewer ACs in the real FE contract. **How to apply:** before scoping any of LNS-373/374/375/376, state explicitly which plumbing is already present and that the remaining work is typed-shape + bespoke body. See [[project-finance-nav-ia]], [[project-accounting-be-done-fe-gap]].
