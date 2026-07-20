"use client";

import { useParams } from "next/navigation";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import Image from "next/image";

export function PaymentLinkImpl() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetInvoice({ id });

  if (loading || !invoice || !(invoice instanceof OutgoingInvoiceEntity) || !invoice.paymentUrl) return null;
  if (invoice.status === OutgoingInvoiceStatus.DRAFT) return null;

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
