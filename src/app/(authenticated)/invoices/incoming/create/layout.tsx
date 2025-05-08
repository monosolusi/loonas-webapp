import React from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import {
  CreateIncomingInvoiceProgressBar
} from "@/app/(authenticated)/invoices/incoming/create/_components/progress-bar";
import { CreateIncomingInvoiceProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import {
  CreateIncomingInvoiceStepsProvider
} from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { CustomBackArrow } from "./_components/custom-back-arrow";

interface CreateIncomingInvoiceLayoutProps {
  children: React.ReactNode,
  recipients: React.ReactNode,
  banks: React.ReactNode,
  upload: React.ReactNode,
  payment: React.ReactNode,
}

export default function CreateIncomingInvoiceLayout(props: CreateIncomingInvoiceLayoutProps) {
  return (
    <CreateIncomingInvoiceProvider>
      <CreateIncomingInvoiceStepsProvider>
        <PageContent>
          <div className="flex flex-col">
            <CustomBackArrow />
            <CreateIncomingInvoiceProgressBar />
          </div>
          <div className="mt-12">
            {props.recipients}
            {props.banks}
            {props.upload}
            {props.payment}
          </div>
        </PageContent>
      </CreateIncomingInvoiceStepsProvider>
    </CreateIncomingInvoiceProvider>
  );
}