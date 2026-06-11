"use client";

import React from "react";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { InvoicePreviewImpl } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/invoice-preview-impl";

export default function ReviewSection() {
  const { currentStep } = useCreateOutgoingInvoice();

  if (currentStep !== "review-and-send") return null;
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <div className="flex flex-1 flex-col">
            <h1 className="text-base font-semibold text-neutral-500">Review & Kirim Invoice</h1>
            <p className="text-sm text-neutral-300">
              Tinjau invoice dengan teliti dan kirim langsung ke pelanggan Anda. Pastikan tidak ada kesalahan sebelum
              tagihan dikirim.
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-1 flex-row space-x-4">
          <InvoicePreviewImpl />
        </div>
      </div>
    </>
  );
}
