"use client";

import { useGetOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-outgoing-invoice";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SendOptionsDialogImpl } from "@/app/(authenticated)/invoices/[id]/@outgoingDetail/_components/send-options-dialog-impl";

export function SendInvoiceButton() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetOutgoingInvoice({ id });
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const canResend = useMemo(() => {
    if (!invoice || loading) return false;
    const resendStatus = [OutgoingInvoiceStatus.READY_TO_SEND, OutgoingInvoiceStatus.SENT];
    return resendStatus.includes(invoice.status);
  }, [invoice, loading]);

  const onClick = () => setDialogOpen(true);
  const onClose = () => setDialogOpen(false);
  const onCompleted = () => setDialogOpen(false);

  if (!invoice || loading) return null;
  if (!canResend) return null;
  return (
    <>
      <PrimaryButton label="Kirim Faktur" onClick={onClick} />
      <SendOptionsDialogImpl open={dialogOpen} onClose={onClose} onCompleted={onCompleted} />
    </>
  );
}
