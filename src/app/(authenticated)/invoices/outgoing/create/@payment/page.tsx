"use client";

import React from "react";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { PaymentConfigurationTableImpl } from "@/app/(authenticated)/invoices/outgoing/create/@payment/_components/payment-configuration-table-impl";

export default function PaymentSettingSection() {
  const { currentStep } = useCreateOutgoingInvoice();

  if (currentStep !== "payment-configuration") return null;
  return (
    <div className="flex flex-col gap-y-4">
      <div>
        <h2 className="text-base font-semibold text-neutral-500">Pengaturan Pembayaran</h2>
        <p className="text-sm text-neutral-300">
          Sesuaikan metode pembayaran yang ditampilkan kepada klien serta pengaturan penanggung biaya untuk setiap
          transaksi.
        </p>
      </div>
      <PaymentConfigurationTableImpl />
    </div>
  );
}
