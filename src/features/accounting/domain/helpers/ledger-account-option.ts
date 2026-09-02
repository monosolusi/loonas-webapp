import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { ACCOUNT_TYPE_LABELS } from "@/features/accounting/domain/enums/account-type";

/**
 * The display parts every ledger-account picker option is built from — plain, local shape (not a
 * `SearchComboboxOption`, which is a `core/presentations/` type the domain layer must not import). Each
 * consuming combobox spreads this into its own option type and attaches whatever else it needs (`entity`).
 *
 * `description` used to be the raw `AccountType` enum value (`"revenue"`, `"asset"`) at five duplicated
 * call sites across three files — one already resolved it correctly through `ACCOUNT_TYPE_LABELS`. This
 * collapses all five onto that one correct mapping. `ACCOUNT_TYPE_LABELS` is a total `Record<AccountType,
 * string>`, so no fallback is needed for a typed `AccountType`.
 */
export function toLedgerAccountOptionParts(account: LedgerAccountEntity): {
  id: string;
  label: string;
  description: string;
} {
  return {
    id: account.id,
    label: `${account.code} — ${account.name}`,
    description: ACCOUNT_TYPE_LABELS[account.type],
  };
}
