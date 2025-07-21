"use client";

import { PaymentSummary } from "@/core/presentations/components/payment-summary";
import { useGetPublicPayInDetailForOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-pay-in-detail-for-outgoing-invoice";
import { useParams } from "next/navigation";

export function PaymentSummaryImpl() {
  const { id } = useParams<{ id: string }>();
  const { payIn, loading } = useGetPublicPayInDetailForOutgoingInvoice({ invoiceId: id });

  console.log(payIn);

  if (!payIn || loading) return null;
  return (
    <PaymentSummary
      selectedPaymentMethod={{ title: payIn.paymentMethod.title }}
      invoiceValue={payIn.summary.invoiceValue}
      fee={payIn.summary.fee}
      totalPayable={payIn.summary.totalPayable}
      isDisabled={true}
    />
  );
}
