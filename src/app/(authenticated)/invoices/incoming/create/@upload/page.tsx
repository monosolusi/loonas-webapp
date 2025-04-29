"use client";

import React from "react";
import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import {
  useCreateIncomingInvoiceSteps
} from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import { UploadButton } from "@/app/(authenticated)/invoices/incoming/create/@upload/_components/upload-button";
import {
  UploadedInvoiceTable
} from "@/app/(authenticated)/invoices/incoming/create/@upload/_components/uploaded-invoice-table";
import { EmptyState } from "@/app/(authenticated)/invoices/incoming/create/@upload/_components/empty-state";
import { FilledButton } from "@/core/presentations/components/filled-button";

export default function UploadInvoicePage() {
  const { currentStep, nextStep } = useCreateIncomingInvoiceSteps();
  const { invoiceDocuments } = useCreateIncomingInvoice();

  if (currentStep !== 3) return null;
  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold text-gray-900">Upload Faktur</h1>
          <p className="mt-2 text-sm text-gray-700">
            Upload faktur yang ingin kamu bayarkan. Kamu bisa upload lebih dari satu faktur.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-none">
          <UploadButton />
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-4 sm:flex-none">
          <FilledButton 
            disabled={invoiceDocuments.length === 0} 
            onClick={() => nextStep?.()}
            type="button"
          >
            Lanjutkan
          </FilledButton>
        </div>
      </div>

      {invoiceDocuments.length > 0 ? <UploadedInvoiceTable /> : <EmptyState />}
    </div>
  );
}