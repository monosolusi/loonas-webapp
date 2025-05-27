"use client";

import React from "react";
import { useListAccountBankAccout } from "@/features/bank/presentation/hooks/use-list-account-bank-account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  HasNoAccountErrorDialog
} from "@/app/(authenticated)/invoices/outgoing/create/_components/has-no-account-error-dialog";
import { PageContent } from "@/core/presentations/components/page-content";
import {
  CreateOutgoingInvoiceProgressStepper
} from "@/app/(authenticated)/invoices/outgoing/create/_components/create-outgoing-invoice-progress-stepper";
import {
  CreateOutgoingInvoiceProvider
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { BackButton } from "@/app/(authenticated)/invoices/outgoing/create/_components/back-button";

interface CreateOutgoingInvoiceLayoutProps {
  children: React.ReactNode,
  recipient: React.ReactNode;
  items: React.ReactNode;
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
      <CreateOutgoingInvoiceProvider maxStep={4}>
        <PageContent>
          <div className="flex flex-col space-y-12">
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row items-start">
                <BackButton />
              </div>
              <CreateOutgoingInvoiceProgressStepper />
            </div>
            <div>
              {props.recipient}
              {props.items}
            </div>
          </div>
        </PageContent>
      </CreateOutgoingInvoiceProvider>
    );
  }
}
