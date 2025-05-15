import React from "react";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { usePaymentRequest } from "@/features/payment/presentations/providers/payment-request";


export function Actions() {
  const { paymentRequest } = usePaymentRequest();

  if (!paymentRequest) return null;
  return (
    <div className="flex space-x-4">
      <div className="flex-1">
        <OutlinedButton>
          Cek Status
        </OutlinedButton>
      </div>
      <div className="flex-1">
        <FilledButton>
          Lihat Semua Faktur
        </FilledButton>
      </div>
    </div>
  );
}