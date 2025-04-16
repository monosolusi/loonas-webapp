import React from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { BackArrow } from "@/core/presentations/components/back-arrow";
import {
  CreateIncomingInvoiceProgressBar
} from "@/app/(authenticated)/invoices/incoming/create/_components/progress-bar";

export default function CreateIncomingInvoiceLayout({ children, recipients }: {
  children: React.ReactNode,
  recipients: React.ReactNode
}) {
  return (
    <PageContent>
      <div className="flex flex-col">
        <BackArrow />
        <CreateIncomingInvoiceProgressBar />
      </div>
      <div className="mt-12">
        {recipients}
      </div>
    </PageContent>
  );
}