import React from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { PageHeading } from "@/core/presentations/components/page-heading";
import { InvoiceProvider } from "@/features/invoice/presentations/providers/invoice";
import { InvoiceTableImpl } from "@/app/(authenticated)/invoices/_components/invoice-table-impl";
import { CreateNewInvoiceButton } from "@/app/(authenticated)/invoices/_components/create-new-button";

export default function InvoiceMainPage() {
  return (
    <InvoiceProvider>
      <PageHeading>Kumpulan Faktur</PageHeading>
      <PageContent>
        <div className="flex-col space-y-4">
          <div className="flex flex-row justify-between">
            <div className="flex-1">
              <p className="text-gray-500">
                Lihat semua invoice Anda dalam satu tempat. Kelola, lacak, dan kirim invoice dengan mudah dan efisien.
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <CreateNewInvoiceButton />
            </div>
          </div>
          <div className="flex-1">
            <InvoiceTableImpl />
          </div>
        </div>
      </PageContent>
    </InvoiceProvider>
  );
}
