"use client";

import { useGetOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-outgoing-invoice";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { FilledButton } from "@/core/presentations/components/filled-button";

export function SendInvoiceButton() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetOutgoingInvoice({ id });

  const canResend = useMemo(() => {
    if (!invoice || loading) return false;
    const resendStatus = [OutgoingInvoiceStatus.READY_TO_SEND, OutgoingInvoiceStatus.SENT];
    return resendStatus.includes(invoice.status);
  }, [invoice, loading]);

  if (!invoice || loading) return null;
  if (!canResend) return null;
  return <FilledButton>Kirim Faktur</FilledButton>;
}
