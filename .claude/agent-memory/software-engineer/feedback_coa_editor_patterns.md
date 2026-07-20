---
name: coa-editor-patterns
description: Key patterns discovered implementing LNS-117 CoA editor — three-state parent sentinel, mutation hook Rule 3, inner component extraction
metadata:
  type: feedback
---

Three-state parent sentinel for update: `undefined` = omit/unchanged, `null` = clear parent, `{ id }` = set new parent. Must be explicit in the UpdateLedgerAccountParams type and not collapsed.

Mutation hook Rule 3 (create-hook-mutation skill): Hooks CAN import repo param types (`CreateLedgerAccountParams` etc.) for trigger typing — this is the one allowed cross-layer import in the presentation layer. Not a violation.

Per-file component rule for delete dialogs with multiple guard states: extract each guard body as its own file (e.g. `coa-account-delete-confirm-body.tsx`, `coa-account-delete-journal-lines-body.tsx`). Co-located private JSX functions in rows/tables that aren't exported are also violations — extract to separate files.

TextInput does NOT support `tooltip` prop — use `description` for disabled-field hints. SelectInput does support `tooltip` via InfoTooltip.

TextInput does NOT support `ref` forwarding — use `autoFocus` prop instead for first-field focus on dialog open.

Provider file exports both `useXxx()` hook and `XxxProvider` component in same file — this is acceptable (standard provider pattern), not a one-component-per-file violation.

`useListLedgerAccounts` hook does not expose `mutate` — for provider `reload`, use `revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_LEDGER_ACCOUNTS)` directly.

**Why:** LNS-117 implementation — patterns not obvious from reading CLAUDE.md alone.
**How to apply:** Apply in all future CoA-related and mutation-hook work.
