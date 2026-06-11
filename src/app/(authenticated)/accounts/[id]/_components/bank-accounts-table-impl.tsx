"use client";

import { useListAccountBankAccout } from "@/features/bank/presentation/hooks/use-list-account-bank-account";
import { BankAccountRow } from "@/app/(authenticated)/accounts/[id]/_components/bank-accounts-table";
import { CreateBankAccountDialog } from "@/app/(authenticated)/accounts/[id]/_components/create-bank-account-dialog";
import { BankAccountsTableLoading } from "@/app/(authenticated)/accounts/[id]/_components/bank-accounts-table-loading";
import { BankAccountsTableError } from "@/app/(authenticated)/accounts/[id]/_components/bank-accounts-table-error";
import { BankAccountsTableContent } from "@/app/(authenticated)/accounts/[id]/_components/bank-accounts-table-content";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import Image from "next/image";
import { useMemo, useState } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export function BankAccountsTableImpl() {
  const { bankAccounts, loading, error } = useListAccountBankAccout();
  const [dialogOpen, setDialogOpen] = useState(false);

  const isEmptyAccount = useMemo(() => {
    return error instanceof ServerError && error.code === ErrorCodes.ACCOUNT_HAS_NO_BANK_ACCOUNT.code;
  }, [error]);

  const headerAction = (
    <PrimaryButton
      label="Tambah Rekening"
      className="h-9 w-auto px-4 text-sm"
      onClick={() => setDialogOpen(true)}
      leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
    />
  );

  const rows: BankAccountRow[] = useMemo(
    () =>
      bankAccounts.map((ba) => {
        const masked =
          ba.accountNumber.length > 4
            ? "*".repeat(ba.accountNumber.length - 4) + ba.accountNumber.slice(-4)
            : ba.accountNumber;
        return {
          id: ba.id,
          bankName: ba.bankName,
          maskedAccountNumber: masked,
          accountHolderName: ba.accountHolderName,
        };
      }),
    [bankAccounts],
  );

  function renderTable() {
    if (loading) return <BankAccountsTableLoading headerAction={headerAction} />;
    if (error && !isEmptyAccount) return <BankAccountsTableError headerAction={headerAction} />;
    return <BankAccountsTableContent rows={rows} headerAction={headerAction} />;
  }

  return (
    <>
      {renderTable()}
      <CreateBankAccountDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}
