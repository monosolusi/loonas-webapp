"use client";

import React from "react";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { PaymentConfigurationTableImpl } from "@/app/(authenticated)/invoices/outgoing/create/@payment/_components/payment-configuration-table-impl";
import { NextButton } from "@/app/(authenticated)/invoices/outgoing/create/@payment/_components/next-button";

const PAYMENT_SETTING_SECTION_STEP = 2;

export default function PaymentSettingSection() {
  const { currentStep } = useCreateOutgoingInvoice();

  if (currentStep !== PAYMENT_SETTING_SECTION_STEP) return null;
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <div className="flex flex-1 flex-col">
            <h1 className="text-base font-semibold text-gray-900">Pengaturan Pembayaran</h1>
            <p className="text-sm text-gray-500">
              Sesuaikan metode pembayaran yang ditampilkan kepada klien serta pengaturan penanggung biaya untuk setiap
              transaksi.
            </p>
          </div>
          <div className="hidden flex-1 md:flex"></div>
        </div>
        <div className="mt-4 flex-1">
          <PaymentConfigurationTableImpl />
        </div>
        <div className="mt-4 flex flex-1 flex-row justify-end gap-x-4">
          <OutlinedButton>Simpan Draft</OutlinedButton>
          <NextButton />
        </div>
      </div>
    </>
  );
}
