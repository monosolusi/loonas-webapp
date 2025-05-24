import React from "react";
import { ListPartnerInvoiceProvider } from "@/features/partner/presentation/providers/list-partner-invoice";
import { InvoiceTableImpl } from "@/app/(authenticated)/clients/[id]/invoices/invoice-table-impl";

export default async function PartnerInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex-1">
        <h2 className="text-base/7 font-semibold text-gray-900">Kumpulan Faktur</h2>
        <p className="mt-1 text-sm/6 text-gray-500">
          Kumpulan faktur yang Anda kirim ke klien maupun yang Anda terima, agar usaha Anda lebih teratur dan efisien.
        </p>
      </div>
      <div className="flex-1">
        <ListPartnerInvoiceProvider partnerId={id}>
          <InvoiceTableImpl />
        </ListPartnerInvoiceProvider>
      </div>
    </div>
  );
}
