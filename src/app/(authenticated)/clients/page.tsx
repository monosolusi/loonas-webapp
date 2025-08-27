import React from "react";
import { PageHeading } from "@/core/presentations/components/page-heading";
import { PageContent } from "@/core/presentations/components/page-content";
import { ClientTableImpl } from "@/app/(authenticated)/clients/_components/client-table-impl";
import { NewClientButton } from "@/features/partner/presentation/components/new-client-button";

export default function ClientPage() {
  return (
    <>
      <PageHeading>Semua Klien Kamu</PageHeading>
      <PageContent>
        <div className="flex-col space-y-4">
          <div className="flex flex-row justify-between">
            <div className="flex-2">
              <p className="text-gray-500">
                Daftar di bawah ini adalah semua klien kamu. Kamu bisa kirim atau terima dana dari mereka.
              </p>
            </div>
            <div className="flex flex-3 justify-end">
              <NewClientButton />
            </div>
          </div>
          <div className="flex-1">
            <ClientTableImpl />
          </div>
        </div>
      </PageContent>
    </>
  );
}
