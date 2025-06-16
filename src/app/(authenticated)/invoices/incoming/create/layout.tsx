import React from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { CreateIncomingInvoiceProgressBar } from "@/app/(authenticated)/invoices/incoming/create/_components/progress-bar";
import { CreateIncomingInvoiceProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { CreateIncomingInvoiceStepsProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { CustomBackArrow } from "./_components/custom-back-arrow";

interface CreateIncomingInvoiceLayoutProps {
  children: React.ReactNode;
  recipients: React.ReactNode;
  banks: React.ReactNode;
  upload: React.ReactNode;
  payment: React.ReactNode;
}

export default function CreateIncomingInvoiceLayout(props: CreateIncomingInvoiceLayoutProps) {
  return (
    <CreateIncomingInvoiceProvider>
      <CreateIncomingInvoiceStepsProvider>
        <PageContent>
          <div className="flex flex-col space-y-12">
            <div className="flex flex-col space-y-2">
              <div className="flex flex-row items-start">
                <CustomBackArrow />
              </div>
              <CreateIncomingInvoiceProgressBar />
            </div>
            <div>
              {props.recipients}
              {props.banks}
              {props.upload}
              {props.payment}
            </div>
          </div>
        </PageContent>
      </CreateIncomingInvoiceStepsProvider>
    </CreateIncomingInvoiceProvider>
  );
}
