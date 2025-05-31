"use client";

import React from "react";
import { v4 as uuid } from "uuid";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { Card } from "@/core/presentations/components/card";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { SenderInformationImpl } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/sender-information-impl";
import { InvoiceTopSummary } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/invoice-top-summary";
import { BilLTo } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/bill-to";
import { InvoiceItemTable } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/invoice-item-table";
import { Note } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/note";
import { Tnc } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/tnc";
import { Signature } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/signature";

const REVIEW_SECTION_STEP = 3;

export default function ReviewSection() {
  const { currentStep } = useCreateOutgoingInvoice();

  if (currentStep !== REVIEW_SECTION_STEP) return null;
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <div className="flex flex-1 flex-col">
            <h1 className="text-base font-semibold text-gray-900">Review & Kirim Invoice</h1>
            <p className="text-sm text-gray-500">
              Tinjau invoice dengan teliti dan kirim langsung ke pelanggan Anda. Pastikan tidak ada kesalahan sebelum
              tagihan dikirim.
            </p>
          </div>
          <div className="hidden flex-1 flex-row space-x-2 md:flex md:justify-end md:self-end">
            <OutlinedButton>Download PDF</OutlinedButton>
            <FilledButton>Kirim Faktur Keluaran</FilledButton>
          </div>
        </div>
        <div className="mt-4 flex flex-1 flex-row space-x-4">
          <Card className="w-full rounded-xs text-sm shadow-md">
            <div className="flex flex-col space-y-4">
              <div className="flex flex-1 flex-row space-x-4">
                <SenderInformationImpl />
                <div className="flex-1"></div>
                <InvoiceTopSummary />
              </div>
              <div className="mt-16 flex w-1/3 flex-col space-y-1">
                <BilLTo />
              </div>
              <div className="flex flex-1">
                <InvoiceItemTable />
              </div>
              <div className="mt-8 flex flex-1 flex-row space-x-4">
                <div className="flex-1 flex-col space-y-4">
                  <Note />
                  <Tnc />
                </div>
                <div className="flex-1">
                  <Signature />
                </div>
              </div>
              <div className="mt-8 flex flex-1 flex-col items-start justify-start text-xs font-light text-gray-400 italic">
                <div className="flex-1">[{uuid()}]</div>
                <div className="flex-1">Invoice ini dibuat dengan aplikasi loonas.id</div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
