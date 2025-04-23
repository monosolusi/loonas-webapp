"use client";

import React, { useState } from "react";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { useBankAccount } from "@/features/bank/presentation/providers/bank-account";
import {
  NewBankAccountDialog
} from "@/app/(authenticated)/invoices/incoming/create/@banks/_components/new-bank-account-dialog";
import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";

export function NewBankAccountButton() {
  const [open, setOpen] = useState(false);
  const { refreshBankAccounts } = useBankAccount();
  const { receiver } = useCreateIncomingInvoice();

  function handleNewBankAccountClick() {
    setOpen(true);
  }

  async function handleCreated() {
    if (receiver) await refreshBankAccounts?.(receiver.id);
    setOpen(false);
  }

  return (
    <>
      <FilledButton onClick={handleNewBankAccountClick}>
        Tambah Rekening Baru
      </FilledButton>
      <NewBankAccountDialog open={open} setOpen={setOpen} onCreated={handleCreated} />
    </>
  );
}