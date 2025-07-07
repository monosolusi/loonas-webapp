"use client";

import { Card } from "@/core/presentations/components/card";
import { useGetPublicOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-outgoing-invoice";
import { useParams } from "next/navigation";
import { PaymentSummary } from "./payment-summary";

interface PaymentSummaryImplProps {
  selectedPaymentMethod?: { title: string; requiresSchemeSelection: boolean };
  selectedScheme?: string;
}

export function PaymentSummaryImpl(props: PaymentSummaryImplProps) {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetPublicOutgoingInvoice({ id });

  if (loading || !invoice) return null;
  if (!props.selectedPaymentMethod) {
    return (
      <Card>
        <p>Silahkan pilih metode pembayaran terlebih dahulu.</p>
      </Card>
    );
  }

  return (
    <PaymentSummary
      selectedPaymentMethod={props.selectedPaymentMethod}
      invoiceValue={invoice.summary.total}
      fee={0}
      totalPayable={0}
      isDisabled={props.selectedPaymentMethod.requiresSchemeSelection && !props.selectedScheme}
    />
  );
}
