---
name: journal_list_hook_rule10_drift
description: use-list-journals.ts (template) imports ListJournalsParams from domain/repositories, violating Rule 10 — don't copy this into new list hooks
metadata:
  type: feedback
---

`src/features/accounting/presentations/hooks/use-list-journals.types.ts` imports
`ListJournalsParams` from `domain/repositories/journal`, not the use case's own
`ListJournalsUseCaseParams` from `domain/usecases/list-journals.usecases.ts`. This is
pre-existing drift against the Rule 10 "UseCase owns its param type" convention (see
[[feedback_usecase_private_methods_plain_return]] family) — `use-get-journal.ts` and the
mutation hooks (`use-create-journal.ts`, `use-reverse-journal.ts`) correctly import from
their usecases, only the list hook doesn't.

**Why:** CLAUDE.md's UseCase-params-independence rule extends structurally to hooks: the
hook's fetcher-params type should reference the usecase's own params type, not reach past
it into the repository. When told to "mirror the journal stack file-for-file," this one
file is the exception — copying it verbatim into a new feature's list hook reproduces a
Rule 10 violation that architecture-review will flag on the NEW file (even though the
journal original goes unflagged as untouched pre-existing code).

**How to apply:** When scaffolding a new `use-list-{noun}.ts` off the journal template,
import the usecase's own `List{Noun}UseCaseParams` type in the `.types.ts` file's fetcher
params, not the repository's `List{Noun}Params`. Applied this way for
`use-list-cash-entries.types.ts` (LNS-736) — imports `ListCashEntriesUseCaseParams` from
`domain/usecases/list-cash-entries.usecases.ts`.
