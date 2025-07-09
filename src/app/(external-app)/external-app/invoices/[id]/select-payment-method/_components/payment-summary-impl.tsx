"use client";

import { Card } from "@/core/presentations/components/card";
import { useGetPublicOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-outgoing-invoice";
import { useParams } from "next/navigation";
import { PaymentSummary } from "./payment-summary";
import { useMemo } from "react";

interface PaymentSummaryImplProps {
  selectedPaymentMethod?: {
    title: string;
    requiresSchemeSelection: boolean;
    pricing: { base: number; percentage: number };
  };
  selectedScheme?: string;
}

export function PaymentSummaryImpl(props: PaymentSummaryImplProps) {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetPublicOutgoingInvoice({ id });

  const fee = useMemo(() => {
    if (!invoice || !props.selectedPaymentMethod) return 0;

    const { base, percentage } = props.selectedPaymentMethod.pricing;
    return base + (invoice.summary.total * percentage) / 100;
  }, [props.selectedPaymentMethod, invoice]);

  const totalPayable = useMemo(() => {
    if (!invoice || !props.selectedPaymentMethod) return 0;

    return invoice.summary.total + fee;
  }, [invoice, fee]);

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
      fee={fee}
      totalPayable={totalPayable}
      isDisabled={props.selectedPaymentMethod.requiresSchemeSelection && !props.selectedScheme}
    />
  );
}
