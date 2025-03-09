import React from "react";
import { EmptyInvoiceState } from "@/app/(home)/home/_components/invoice-empty";


export function RecentInvoices() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none flex justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Riwayat Faktur Terbaru
          </h2>
          <a href="#" className="text-sm/6 font-semibold text-primary-600 hover:text-indigo-500">
            Lihat semua
          </a>
        </div>
      </div>
      <div className="mt-6 overflow-hidden border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <EmptyInvoiceState />
            {/*<RecentInvoicesTable />*/}
          </div>
        </div>
      </div>
    </div>
  );
}