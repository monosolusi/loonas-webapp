import React from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { Card } from "@/core/presentations/components/card";
import { SelectorItem } from "@/core/presentations/components/selector-item";
import { CreateInvoiceQuestions } from "@/app/(authenticated)/invoices/_components/create-invoice-faq";

export default function CreateInvoicePage() {
  return (
    <PageContent>
      <div className="grid grid-cols-1 space-y-6">
        <div className="flex flex-col space-y-6 sm:flex-row sm:space-x-6 sm:space-y-0">
          <div className="flex-1">
            <Card className="h-full flex items-center">
              <SelectorItem
                href="/invoices/incoming/create"
                title="Faktur Masukan"
                description="Mau bayar tagihan dari supplier? Di sini kamu bisa unggah fotonya atau salin manual ke sistem Loonas."
              />
            </Card>
          </div>
          <div className="flex-1">
            <Card className="h-full flex items-center">
              <SelectorItem
                href="/invoices/outgoing/create"
                title="Faktur Keluaran"
                description="Kamu sebagai penjual? Pilih ini untuk kirim tagihan ke pelanggan."
              />
            </Card>
          </div>
        </div>
        <div className="sm:col-span-2">
          <Card>
            <div className="py-4 px-6">
              <CreateInvoiceQuestions />
            </div>
          </Card>
        </div>
      </div>
    </PageContent>
  );
}
