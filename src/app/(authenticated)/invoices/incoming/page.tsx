"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IncomingInvoiceTableImpl } from "./_components/incoming-invoice-table-impl";

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
      <div className="flex flex-row gap-x-4">
        {/* Belum Dibayar */}
        <div className="border-b-warning-200/50 border-warning-50 border-warning-200/60 flex flex-1 flex-row justify-between rounded-xl border border-t border-r border-b-4 border-l bg-neutral-50 p-5">
          <div className="flex flex-col gap-y-3">
            <span className="text-sm leading-5 text-neutral-300">Belum Dibayar</span>
            <div className="flex flex-col gap-y-1.5">
              <span className="text-2xl leading-8 font-bold tracking-tight text-neutral-500">Rp 40.600.000</span>
              <span className="text-warning-400 text-xs leading-4">5 faktur menunggu</span>
            </div>
          </div>
          <div className="bg-warning-50 flex size-10 items-center justify-center rounded-lg">
            <Image
              src="/assets/images/circle-dollar-sign-icon-warning-300-w20-h20.svg"
              alt="Belum Dibayar"
              width={20}
              height={20}
            />
          </div>
        </div>

        {/* Total Faktur */}
        <div className="border-b-primary-200/50 border-primary-50 border-primary-200/60 flex flex-1 flex-row justify-between rounded-xl border border-t border-r border-b-4 border-l bg-neutral-50 p-5">
          <div className="flex flex-col gap-y-3">
            <span className="text-sm leading-5 text-neutral-300">Total Faktur</span>
            <div className="flex flex-col gap-y-1.5">
              <span className="text-2xl leading-8 font-bold tracking-tight text-neutral-500">9</span>
              <span className="text-primary-300 text-xs leading-4">Semua faktur aktif</span>
            </div>
          </div>
          <div className="bg-primary-50 flex size-10 items-center justify-center rounded-lg">
            <Image
              src="/assets/images/document-icon-primary-300-w16-h16.svg"
              alt="Total Faktur"
              width={16}
              height={16}
            />
          </div>
        </div>

        {/* Telah Dibayar */}
        <div className="border-b-success-200/50 border-success-50 border-success-200/60 flex flex-1 flex-row justify-between rounded-xl border border-t border-r border-b-4 border-l bg-neutral-50 p-5">
          <div className="flex flex-col gap-y-3">
            <span className="text-sm leading-5 text-neutral-300">Telah Dibayar</span>
            <div className="flex flex-col gap-y-1.5">
              <span className="text-2xl leading-8 font-bold tracking-tight text-neutral-500">4</span>
              <span className="text-success-400 text-xs leading-4">Pembayaran selesai</span>
            </div>
          </div>
          <div className="bg-success-50 flex size-10 items-center justify-center rounded-lg">
            <Image src="/assets/images/check-icon-success-300-w40-h40.svg" alt="Telah Dibayar" width={20} height={20} />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex flex-col gap-y-4">
        <IncomingInvoiceTableImpl />
      </div>
    </div>
  );
}
