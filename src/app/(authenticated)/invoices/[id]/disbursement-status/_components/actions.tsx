"use client";

import React from "react";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { usePaymentRequest } from "@/features/payment/presentations/providers/payment-request";
import { useRouter } from "next/navigation";


export function Actions() {
  const router = useRouter();
  const { paymentRequest } = usePaymentRequest();

  const handleRefresh = () => {
    window.location.reload();
  };

  const navigateToInvoiceList = () => {
    router.push("/invoices");
  };

  if (!paymentRequest) return null;
  return (
    <div className="flex space-x-4">
      <div className="flex-1">
        <OutlinedButton onClick={handleRefresh}>
          Cek Status
        </OutlinedButton>
      </div>
      <div className="flex-1">
        <FilledButton onClick={navigateToInvoiceList}>
          Lihat Semua Faktur
        </FilledButton>
      </div>
    </div>
  );
}
