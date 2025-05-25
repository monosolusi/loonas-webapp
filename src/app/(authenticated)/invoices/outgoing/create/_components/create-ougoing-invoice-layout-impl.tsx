"use client";

import React from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useAccountBankAccount } from "@/features/account/presentation/providers/account-bank-account";
import { useRouter } from "next/navigation";
import {
  HasNoAccountErrorDialog
} from "@/app/(authenticated)/invoices/outgoing/create/_components/has-no-account-error-dialog";

interface CreateOutgoingInvoiceLayoutImplProps {
  children: React.ReactNode;
}

export function CreateOugoingInvoiceLayoutImpl(props: CreateOutgoingInvoiceLayoutImplProps) {
  const router = useRouter();
  const { loading, error } = useAccountBankAccount();

  if (error) {
    if (error instanceof ServerError) {
      if (error.code === ErrorCodes.ACCOUNT_HAS_NO_BANK_ACCOUNT.code) {
        return <HasNoAccountErrorDialog />;
      } else return null;
    } else return null;
  }

  // If nothing happens, return back the children
  if (!loading && !error) return props.children;

}
