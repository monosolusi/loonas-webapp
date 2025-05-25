"use client";

import React from "react";
import { AccountBankAccountProvider } from "@/features/account/presentation/providers/account-bank-account";
import {
  CreateOugoingInvoiceLayoutImpl
} from "@/app/(authenticated)/invoices/outgoing/create/_components/create-ougoing-invoice-layout-impl";

export default function CreateOutgoingInvoiceLayout(props: { children: React.ReactNode }) {
  return (
    <AccountBankAccountProvider>
      <CreateOugoingInvoiceLayoutImpl>
        {props.children}
      </CreateOugoingInvoiceLayoutImpl>
    </AccountBankAccountProvider>
  );
}
