"use client";

import { useParams } from "next/navigation";
import { useGetOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-outgoing-invoice";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import Image from "next/image";

export function PaymentLinkImpl() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetOutgoingInvoice({ id });

  if (loading || !invoice || !invoice.paymentUrl) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(invoice.paymentUrl!);
  };

  return (
    <SecondaryButton
      outlined
      label="Salin Link Pembayaran"
      onClick={handleCopy}
      leftIcon={<Image src="/assets/images/copy-icon-neutral-200-w12-h12.svg" alt="" width={16} height={16} />}
    />
  );
}
