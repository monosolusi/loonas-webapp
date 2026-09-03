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

  // `LoonasDialog`'s panel stays mounted through its 200ms `data-leave` fade while the provider has
  // already nulled `accountCategory` — latch the CATEGORY itself (LNS-742 pattern, mirroring
  // `cash-category-delete-dialog.tsx`'s `deletingCategory` latch), not just its derived account. That
  // keeps the resolver running against the closing category through the fade, so `name`, `direction`,
  // the resolved account, and both red notices all stay coherent instead of any one of them reverting
  // to a stale value latched from a PREVIOUS dialog session. The error stays UNLATCHED (LNS-742
  // corollary): `openAccountEdit` nulls it in the same batch as the holder.
  const category = useLatchedValue(accountCategory);

  const currentAccountId = pickedAccountId ?? category?.account.id ?? null;
  const { state, canSubmit } = resolveAccountEditField(currentAccountId, accounts, accountsError);
  const account = state.kind === "resolved" ? state.account : null;
  const missingSavedAccountId = state.kind === "missing" ? state.savedId : null;
  const accountListErrorMessage = state.kind === "error" ? CASH_CATEGORY_ACCOUNT_COPY.accountListErrorNotice : null;

  return (
    <CashCategoryAccountFormDialog
      open={!!accountCategory}
      direction={category?.direction ?? CashEntryDirection.In}
      name={category?.name ?? ""}
      account={account}
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
