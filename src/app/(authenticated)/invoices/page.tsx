import React from "react";
import { RecentInvoicesTable } from "@/app/(authenticated)/home/_components/recent-invoices-table";
import { PageContent } from "@/core/presentations/components/page-content";
import { PageHeading } from "@/core/presentations/components/page-heading";

export default function InvoiceMainPage() {
  return (
    <>
      <PageHeading>Kumpulan Faktur</PageHeading>
      <PageContent>
        <RecentInvoicesTable />
      </PageContent>
    </>
  );
}