"use client";

import { useListAccountBankAccout } from "@/features/bank/presentation/hooks/use-list-account-bank-account";
import {
  BankAccountsTable,
  BankAccountRow,
} from "@/app/(authenticated)/settings/bank-accounts/_components/bank-accounts-table";
import { CreateBankAccountDialog } from "@/app/(authenticated)/settings/bank-accounts/_components/create-bank-account-dialog";
import { SectionCard } from "@/core/presentations/components/section-card";
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

  if (loading) {
    return (
      <SectionCard
        title="Rekening Bank"
        iconSrc="/assets/images/credit-card-icon-primary-300-w16-h16.svg"
        headerAction={headerAction}
      >
        <div className="flex items-center justify-center py-12">
          <span className="text-sm text-neutral-300">Memuat data...</span>
        </div>
      </SectionCard>
    );
  }

  if (error && !isEmptyAccount) {
    return (
      <SectionCard
        title="Rekening Bank"
        iconSrc="/assets/images/credit-card-icon-primary-300-w16-h16.svg"
        headerAction={headerAction}
      >
        <div className="flex items-center justify-center py-12">
          <span className="text-sm text-neutral-300">Gagal memuat data rekening.</span>
        </div>
      </SectionCard>
    );
  }

  const rows: BankAccountRow[] = bankAccounts.map((ba) => {
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
  });

  return (
    <>
      <SectionCard
        title="Rekening Bank"
        iconSrc="/assets/images/credit-card-icon-primary-300-w16-h16.svg"
        headerAction={headerAction}
        bodyClassName="p-0"
      >
        <BankAccountsTable rows={rows} />
      </SectionCard>
      <CreateBankAccountDialog open={dialogOpen} onClose={() => setDialogOpen(false)} />
    </>
  );
}
