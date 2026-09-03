"use client";

import { useEffect, useState } from "react";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { useListAllLedgerAccounts } from "@/features/accounting/presentations/hooks/use-list-all-ledger-accounts";
import { useLatchedValue } from "@/core/presentations/hooks/use-latched-value";
import { useCashCategoriesProvider } from "@/app/(authenticated)/accounting/cash-categories/_providers/cash-categories-provider";
import { resolveAccountEditField } from "@/app/(authenticated)/accounting/cash-categories/_utils/resolve-account-edit-field";
import { CASH_CATEGORY_ACCOUNT_COPY } from "@/app/(authenticated)/accounting/cash-categories/_utils/cash-category-account-copy";
import { CashCategoryAccountFormDialog } from "@/app/(authenticated)/accounting/cash-categories/_components/cash-category-account-form-dialog";

export function CashCategoryAccountDialog() {
  const { accountCategory, closeAccountEdit, submitAccountEdit, isUpdating, accountEditError } =
    useCashCategoriesProvider();
  const { accounts, error: accountsError } = useListAllLedgerAccounts();

  // `null` = the picker was left untouched, so the saved account id is the current selection.
  const [pickedAccountId, setPickedAccountId] = useState<string | null>(null);

  useEffect(() => {
    if (accountCategory) setPickedAccountId(null);
  }, [accountCategory]);

  const currentAccountId = pickedAccountId ?? accountCategory?.account.id ?? null;
  const { state, canSubmit } = resolveAccountEditField(currentAccountId, accounts, accountsError);
  const account = state.kind === "resolved" ? state.account : null;
  const missingSavedAccountId = state.kind === "missing" ? state.savedId : null;
  const accountListErrorMessage = state.kind === "error" ? CASH_CATEGORY_ACCOUNT_COPY.accountListErrorNotice : null;

  // `LoonasDialog`'s panel stays mounted through its 200ms `data-leave` fade while the provider has
  // already nulled `accountCategory` — latch the last non-null display values (LNS-742 pattern),
  // mirroring `cash-category-edit-dialog.tsx`. The error stays UNLATCHED (LNS-742 corollary):
  // `openAccountEdit` nulls it in the same batch as the holder.
  const direction = useLatchedValue(accountCategory?.direction ?? null);
  const categoryName = useLatchedValue(accountCategory?.name ?? null);
  // `account` is legitimately null WHILE OPEN too (the `missing` / `error` resolver states), unlike
  // `direction`/`categoryName` above which can only be null while closing (they derive from
  // `accountCategory` itself). `useLatchedValue` can't distinguish those cases — it returns the last
  // non-null value on every render where the live value is null — so latching `account` unconditionally
  // would paint a stale, previously-selected account underneath the "not found"/"failed to load" notice.
  // Scope the latch to the closing window only: pass the live value (including null) while the dialog
  // is open, and fall back to the latch only once `accountCategory` itself has gone null.
  const latchedAccount = useLatchedValue(account);
  const displayAccount = accountCategory ? account : latchedAccount;

  return (
    <CashCategoryAccountFormDialog
      open={!!accountCategory}
      direction={direction ?? CashEntryDirection.In}
      name={categoryName ?? ""}
      account={displayAccount}
      missingSavedAccountId={missingSavedAccountId}
      accountListErrorMessage={accountListErrorMessage}
      canSubmit={canSubmit}
      loading={isUpdating}
      accountError={accountEditError?.placement === "account" ? accountEditError.message : null}
      formError={accountEditError?.placement === "form" ? accountEditError.message : null}
      onAccountChange={(next) => setPickedAccountId(next?.id ?? null)}
      onSubmit={() => canSubmit && account && void submitAccountEdit({ accountId: account.id })}
      onClose={closeAccountEdit}
    />
  );
}
