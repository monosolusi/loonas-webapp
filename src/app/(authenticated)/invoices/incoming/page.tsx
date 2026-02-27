"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useRouter } from "next/navigation";
import { IncomingInvoiceTableImpl } from "./_components/incoming-invoice-table-impl";
import { IncomingInvoiceStatisticsImpl } from "./_components/incoming-invoice-statistics-impl";

export default function IncomingInvoicePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-y-6">
      {/*  Header */}
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <span className="text-2xl leading-8 font-bold tracking-tight">Tagihan & Biaya</span>
          <span className="text-sm leading-5">Pantau semua pengeluaran dan status pembayaran faktur.</span>
        </div>
        <div className="flex flex-row gap-x-3">
          <div className="flex">
            <SecondaryButton outlined label="Export Laporan" />
          </div>
          <div className="flex">
            <PrimaryButton label="Buat Faktur Baru" onClick={() => router.push("/invoices/incoming/create")} />
          </div>
        </div>
      </div>

      {/*  Statistics */}
      <IncomingInvoiceStatisticsImpl />

      {/* Table */}
      <div className="flex flex-col gap-y-4">
        <IncomingInvoiceTableImpl />
      </div>
    </div>
  );
}
