import React from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { SelectorItem } from "@/core/presentations/components/selector-item";
import { CreateInvoiceQuestions } from "@/app/(authenticated)/invoices/_components/create-invoice-faq";

export default function CreateInvoicePage() {
  return (
    <PageContent>
      <div className="grid grid-cols-1 space-y-6">
        <div className="flex flex-col space-y-6 sm:flex-row sm:space-x-6 sm:space-y-0">
          <div className="flex-1">
            <div className="flex h-full items-center rounded-lg border border-neutral-200 bg-white p-6">
              <SelectorItem
                href="/invoices/incoming/create"
                title="Faktur Masukan"
                description="Mau bayar tagihan dari supplier? Di sini kamu bisa unggah fotonya atau salin manual ke sistem Loonas."
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex h-full items-center rounded-lg border border-neutral-200 bg-white p-6">
              <SelectorItem
                href="/invoices/outgoing/create"
                title="Faktur Keluaran"
                description="Kamu sebagai penjual? Pilih ini untuk kirim tagihan ke pelanggan."
              />
            </div>
          </div>
        </div>
        <div className="sm:col-span-2">
          <div className="rounded-lg border border-neutral-200 bg-white px-6 py-4">
            <CreateInvoiceQuestions />
          </div>
        </div>
      </div>
    </PageContent>
  );
}
