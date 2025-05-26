"use client";

import React from "react";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import {
  ClientTableImpl
} from "@/app/(authenticated)/invoices/outgoing/create/@recipient/_components/client-table-impl";
import {
  useCreateOutgoingInvoice
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import {
  NewClientButton
} from "@/app/(authenticated)/invoices/outgoing/create/@recipient/_components/new-client-button";

const RECIPIENT_SECTION_STEP = 0;

export default function RecipientSection() {
  const { currentStep } = useCreateOutgoingInvoice();

  if (currentStep !== RECIPIENT_SECTION_STEP) return null;
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <div className="flex flex-1 flex-col">
            <h1 className="text-base font-semibold text-gray-900">Klien</h1>
            <p className="text-sm text-gray-700">
              Pilih klien tujuan agar kamu bisa mengirimkan invoice dengan mudah.
            </p>
          </div>
          <div className="self-end">
            <NewClientButton />
          </div>
        </div>
        <div className="flex-1 mt-4">
          <ClientTableImpl />
        </div>
        <div className="mt-4 flex-1 flex flex-row justify-end gap-x-4">
          <OutlinedButton>
            Simpan Draft
          </OutlinedButton>
        </div>
      </div>
    </>
  );
}
