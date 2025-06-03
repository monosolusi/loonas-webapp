"use client";

import React from "react";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { SendOptionsButton } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/send-options-button";
import { InvoicePreviewImpl } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/invoice-preview-impl";

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
            <SendOptionsButton />
          </div>
        </div>
        <div className="mt-4 flex flex-1 flex-row space-x-4">
          <InvoicePreviewImpl />
        </div>
      </div>
    </>
  );
}
