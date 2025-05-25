"use client";

import React from "react";
import { useListAccountBankAccout } from "@/features/bank/presentation/hooks/use-list-account-bank-account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  HasNoAccountErrorDialog
} from "@/app/(authenticated)/invoices/outgoing/create/_components/has-no-account-error-dialog";
import { PageContent } from "@/core/presentations/components/page-content";

interface CreateOutgoingInvoiceLayoutProps {
  children: React.ReactNode,
  recipient: React.ReactNode;
}

export default function CreateOutgoingInvoiceLayout(props: CreateOutgoingInvoiceLayoutProps) {
  const { loading, error } = useListAccountBankAccout();

  if (error) {
    if (error instanceof ServerError) {
      if (error.code === ErrorCodes.ACCOUNT_HAS_NO_BANK_ACCOUNT.code) {
        return <HasNoAccountErrorDialog />;
      } else return null;
    } else return null;
  }

  // If nothing happens, return the children
  if (!loading && !error) {
    return (
      <PageContent>
        {props.recipient}
      </PageContent>
    );
  }
}
