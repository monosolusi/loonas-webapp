import React from "react";
import Link from "next/link";
import { RecentInvoiceTableImpl } from "@/app/(authenticated)/home/_components/recent-invoice-table-impl";

export function RecentInvoices() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-2xl justify-between lg:mx-0 lg:max-w-none">
          <div className="flex flex-1 flex-col space-y-1">
            <h2 className="text-lg font-semibold text-gray-900">Riwayat Faktur Terbaru</h2>
            <div className="text-sm text-gray-500">
              Buat, kirim, dan terima pembayaran invoice bisnis dengan mudah. Pantau semua transaksi secara real-time
              di. Loonas.
            </div>
          </div>
          <Link href="/invoices" className="text-primary-default hover:text-primary-500 text-sm/6 font-semibold">
            Lihat semua
          </Link>
        </div>
      </div>
      <div className="mt-6 overflow-hidden">
        <div className="mx-auto lg:max-w-7xl">
          <RecentInvoiceTableImpl />
        </div>
      </div>
    </div>
  );
}
