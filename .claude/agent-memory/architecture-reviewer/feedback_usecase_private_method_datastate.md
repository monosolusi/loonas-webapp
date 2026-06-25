---
name: usecase-private-method-datastate
description: Use-case private methods must return plain types and throw on failure — not return DataState back to execute()
metadata:
  type: feedback
---

Private methods in use cases must return plain domain types (e.g. `Promise<JournalEntity>`), not `Promise<DataState<T>>`. They throw on `DataFailed` (via `throw result.error`) so `execute()`'s outer `try/catch` handles all error paths. Returning `DataState` from a private method forces `execute()` to inspect it again, breaking the clean-workflow intent.

**Why:** CLAUDE.md Rule 11 — "Private methods return plain types (NOT DataState) — handle DataState internally. Private methods throw on DataFailed instead of returning it." The `execute()` method should read as a linear sequence of private-method calls.

**How to apply:** In any new use case, check every private method's return type. If it says `Promise<DataState<T>>`, flag as Major. The correct pattern: private method checks `if (result instanceof DataFailed) throw result.error`, optionally checks for null data, then returns the plain value. `execute()` wraps the private-method call result in `new DataSuccess(...)`.

See also: LNS-379 `post-opening-balance.usecases.ts:48-63` — `postBalance` returned `Promise<DataState<JournalEntity>>` when it should have returned `Promise<JournalEntity>` and thrown on failure.

**Pre-existing pattern exception (accounting report use cases):** All report use cases in `src/features/accounting/domain/usecases/get-*-report.usecases.ts` (neraca, laba-rugi, arus-kas, calk) have a `fetchReport` private method that returns `Promise<DataState<T>>` and `execute()` simply returns its result. This is a pre-existing pattern consistent across the entire report use-case family. When reviewing a new report use case that copies this pattern, classify as pre-existing tech debt (not change-introduced), and recommend a single cleanup ticket for all report use cases rather than blocking the PR.
