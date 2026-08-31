import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import {
  CashEntrySettingsSelection,
  resolveSelectedAccount,
} from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-settings-form-state";

export type CashEntrySettingsAccountFieldState = {
  /** The entity the combobox displays — `null` while the selection is `empty` or `missing`. */
  account: LedgerAccountEntity | null;
  /** Non-null when the saved default's id is absent from the ledger-account list. */
  missingSavedId: string | null;
  /**
   * A stale saved id is clearable even though no account is displayed — clearing it is the
   * remedy that unblocks the save. Only a truly empty selection offers nothing to clear.
   */
  canClear: boolean;
};

/**
 * Pure `(selection, accounts) → the field's display props`. Keeps every "is anything shown, is
 * anything clearable" decision out of the component, which renders this object verbatim.
 */
export function resolveAccountFieldState(
  selection: CashEntrySettingsSelection,
  accounts: ReadonlyArray<LedgerAccountEntity> | null,
): CashEntrySettingsAccountFieldState {
  return {
    account: resolveSelectedAccount(selection, accounts),
    missingSavedId: selection.kind === "missing" ? selection.savedId : null,
    canClear: selection.kind !== "empty",
  };
}
