"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useRouter } from "next/navigation";
import { OutgoingInvoiceStatisticsImpl } from "@/app/(authenticated)/invoices/outgoing/_components/outgoing-invoice-statistics-impl";
import { OutgoingInvoiceTableImpl } from "@/app/(authenticated)/invoices/outgoing/_components/outgoing-invoice-table-impl";

export default function OutgoingInvoicePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-y-6">
      {/*  Header */}
      <div className="flex flex-row items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <span className="text-2xl leading-8 font-bold tracking-tight">Penagihan</span>
          <span className="text-sm leading-5">Pantau semua penagihan ke pelanggan dan status penerimaannya.</span>
        </div>
        <div className="flex flex-row gap-x-3">
          <div className="flex">
            <SecondaryButton outlined label="Export Laporan" />
          </div>
          <div className="flex">
            <PrimaryButton label="Buat Faktur Baru" onClick={() => router.push("/invoices/outgoing/create")} />
          </div>
        </div>
      </div>

      {/*  Statistics */}
      <OutgoingInvoiceStatisticsImpl />

      {/* Table */}
      <div className="flex flex-col gap-y-4">
        <OutgoingInvoiceTableImpl />
      </div>
    </div>
  );
}
