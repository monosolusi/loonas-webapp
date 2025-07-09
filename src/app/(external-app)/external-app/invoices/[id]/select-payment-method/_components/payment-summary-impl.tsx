"use client";

import { Card } from "@/core/presentations/components/card";
import { useGetPublicOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-outgoing-invoice";
import { useParams } from "next/navigation";
import { PaymentSummary } from "../../../../../../../core/presentations/components/payment-summary";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

interface PaymentSummaryImplProps {
  selectedPaymentMethod?: {
    id: string;
    title: string;
    requiresSchemeSelection: boolean;
    pricing: { base: number; percentage: number };
  };
  selectedScheme?: string;
}

export function PaymentSummaryImpl(props: PaymentSummaryImplProps) {
  const router = useRouter();
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

  const handleClick = () => {
    if (!props.selectedPaymentMethod) return;

    const searchParams = new URLSearchParams();
    searchParams.set("payment_method", props.selectedPaymentMethod.id);
    if (props.selectedScheme) searchParams.set("payment_scheme", props.selectedScheme);
    router.push("./pay-in-detail?" + searchParams.toString());
  };

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
      onClick={handleClick}
    />
  );
}
