import React from "react";
import { RecentInvoiceTableImpl } from "@/app/(authenticated)/home/_components/recent-invoice-table-impl";
import { InvoiceProvider } from "@/features/invoice/presentations/providers/invoice";


export function RecentInvoices() {
  return (
    <InvoiceProvider limit={5}>
      <div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none flex justify-between">
            <h2 className="text-base font-semibold text-gray-900">
              Riwayat Faktur Terbaru
            </h2>
            <a href="#" className="text-sm/6 font-semibold text-primary-default hover:text-primary-500">
              Lihat semua
            </a>
          </div>
        </div>
        <div className="mt-6 overflow-hidden">
          <div className="lg:max-w-7xl mx-auto">
            <RecentInvoiceTableImpl />
          </div>
        </div>
      </div>
    </InvoiceProvider>
  );
}
