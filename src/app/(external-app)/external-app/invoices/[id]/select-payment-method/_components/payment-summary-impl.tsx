"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { useGetPublicOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-outgoing-invoice";
import { useParams, useRouter } from "next/navigation";
import { PaymentSummary } from "@/core/presentations/components/payment-summary";
import { useMemo } from "react";
import { useCreateOutgoingInvoicePayIn } from "@/features/invoice/presentations/hooks/use-create-outgoing-invoice-pay-in";
import { useGetPublicPayInDetailForOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-pay-in-detail-for-outgoing-invoice";

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
  const { trigger, isMutating } = useCreateOutgoingInvoicePayIn();
  const { refresh } = useGetPublicPayInDetailForOutgoingInvoice({ invoiceId: id });

  const fee = useMemo(() => {
    if (!invoice || !props.selectedPaymentMethod) return 0;
    if (props.selectedPaymentMethod.requiresSchemeSelection && !props.selectedScheme) return 0;

    const { base, percentage } = props.selectedPaymentMethod.pricing;
    return base + (invoice.summary.total * percentage) / 100;
  }, [props.selectedPaymentMethod, props.selectedScheme, invoice]);

  const totalPayable = useMemo(() => {
    if (!invoice || !props.selectedPaymentMethod) return 0;

    return invoice.summary.total + fee;
  }, [invoice, props.selectedPaymentMethod, fee]);

  const handleClick = async () => {
    if (!props.selectedPaymentMethod) return;
    if (isMutating) return;

    await trigger({
      invoiceId: id,
      paymentMethodId: props.selectedPaymentMethod.id,
      paymentScheme: props.selectedScheme || null,
    });

    // Before navigating to the ./pay-in-detail, let's try to mutate the new PayIn, so we don't face any issue later
    await refresh();

    router.push("./pay-in-detail");
  };

  if (loading || !invoice) return null;
  if (!props.selectedPaymentMethod) {
    return (
      <SectionCard title="Ringkasan Pembayaran">
        <p>Silahkan pilih metode pembayaran terlebih dahulu.</p>
      </SectionCard>
    );
  }

  return (
    <PaymentSummary
      selectedPaymentMethod={props.selectedPaymentMethod}
      invoiceValue={invoice.summary.total}
      fee={fee}
      totalPayable={totalPayable}
      isDisabled={(props.selectedPaymentMethod.requiresSchemeSelection && !props.selectedScheme) || isMutating}
      isLoading={isMutating}
      onClick={handleClick}
    />
  );
}
