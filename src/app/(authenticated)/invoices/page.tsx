import React from "react";
import { RecentInvoicesTable } from "@/app/(authenticated)/home/_components/recent-invoices-table";
import { PageContent } from "@/core/presentations/components/page-content";
import { PageHeading } from "@/core/presentations/components/page-heading";
import { CreateNewInvoiceButton } from "@/app/(authenticated)/invoices/_components/create-new-button";

export default function InvoiceMainPage() {
  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <PageHeading>Kumpulan Faktur</PageHeading>
        </div>
        <div className="mx-auto px-4 sm:flex-nowrap sm:px-6 lg:px-8">
          <CreateNewInvoiceButton />
        </div>
      </div>
      <PageContent>
        <RecentInvoicesTable />
      </PageContent>
    </>
  );
}