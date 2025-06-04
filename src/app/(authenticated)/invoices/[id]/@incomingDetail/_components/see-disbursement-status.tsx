"use client";

import React from "react";
import { InvoiceStatus } from "@/features/invoice/domain/entities/invoice";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { useRouter } from "next/navigation";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";

interface SeeDisbursementStatusProps {
  invoiceId: string;
  status: InvoiceStatus;
}

export function SeeDisbursementStatus(props: SeeDisbursementStatusProps) {
  const router = useRouter();

  if (props.status === PaymentRequestStatus.COMPLETED) return null;
  else return (
    <OutlinedButton onClick={() => router.push(`/invoices/${props.invoiceId}/disbursement-status`)}>
      Lihat Status Faktur
    </OutlinedButton>
  );
}
