"use client";

import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { SendOptionsDialog } from "@/app/(authenticated)/invoices/_components/send-options-dialog";
import { useSendInvoice } from "@/features/invoice/presentations/hooks/use-send-invoice";
import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";

interface SendOptionsDialogImplProps {
  open: boolean;
  onClose?: () => void;
  onCompleted?: () => void | Promise<void>;
}

export function SendOptionsDialogImpl(props: SendOptionsDialogImplProps) {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetInvoice({ id });
  const { trigger } = useSendInvoice();

  const availableChannels = useMemo(() => {
    if (!invoice || loading || !(invoice instanceof OutgoingInvoiceEntity)) return [];
    return invoice.sendChannel;
  }, [invoice, loading]);

  const onSendClick = async (channels: NotificationChannel[]) => {
    await trigger({ invoice: { id }, sendChannel: channels });
    if (props.onCompleted) await props.onCompleted();
  };

  if (!invoice || loading || !(invoice instanceof OutgoingInvoiceEntity)) return null;
  return (
    <SendOptionsDialog
      {...props}
      recipient={{
        name: invoice.recipient.fullName,
        phoneNumber: invoice.recipient.phoneNumber,
        email: invoice.recipient.email,
      }}
      onSendClick={onSendClick}
      availableChannels={availableChannels}
    />
  );
}
