import React from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { BackArrow } from "@/core/presentations/components/back-arrow";
import {
  CreateIncomingInvoiceProgressBar
} from "@/app/(authenticated)/invoices/incoming/create/_components/progress-bar";
import { CreateIncomingInvoiceProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import {
  CreateIncomingInvoiceStepsProvider
} from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";

export default function CreateIncomingInvoiceLayout({ 
  children, 
  recipients, 
  banks, 
  upload,
  payment
}: {
  children: React.ReactNode,
  recipients: React.ReactNode,
  banks: React.ReactNode,
  upload: React.ReactNode,
  payment: React.ReactNode,
}) {
  return (
    <CreateIncomingInvoiceProvider>
      <CreateIncomingInvoiceStepsProvider>
        <PageContent>
          <div className="flex flex-col">
            <BackArrow />
            <CreateIncomingInvoiceProgressBar />
          </div>
          <div className="mt-12">
            {recipients}
            {banks}
            {upload}
            {payment}
          </div>
        </PageContent>
      </CreateIncomingInvoiceStepsProvider>
    </CreateIncomingInvoiceProvider>
  );
}