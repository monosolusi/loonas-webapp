"use client";

import React, { useMemo } from "react";
import { useBankAccount } from "@/features/bank/presentation/providers/bank-account";
import {
  BankAccount,
  BankAccountItem
} from "@/app/(authenticated)/clients/[id]/bank-accounts/_components/bank-account";

export function BankAccountImpl() {
  const { bankAccounts, loading } = useBankAccount();

  const formattedData: BankAccountItem[] = useMemo(() => {
    return bankAccounts?.map((bankAccount) => ({
      bankName: bankAccount.bankName,
      accountNumber: bankAccount.accountNumber,
      accountHolderName: bankAccount.accountHolderName
    }));
  }, [bankAccounts]);

  if (loading || !bankAccounts) return null;
  return <BankAccount data={formattedData} />;
}
