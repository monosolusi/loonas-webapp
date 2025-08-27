"use client";

import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { useCreateOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-create-outgoing-invoice";
import { useCreateOutgoingInvoice as useCreateOutgoingInvoiceProvider } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";
import { SendOptionsDialog } from "@/app/(authenticated)/invoices/_components/send-options-dialog";
import { useGetNotificationConfig } from "@/features/notification/presentation/hooks/use-get-notification-config";
import { useMemo } from "react";

interface SendOptionsDialogImplProps {
  open: boolean;
  onClose?: () => void;
  onCompleted?: (item: OutgoingInvoiceEntity) => void | Promise<void>;
}

export function SendOptionsDialogImpl(props: SendOptionsDialogImplProps) {
  const { trigger } = useCreateOutgoingInvoice();
  const { recipient, invoiceNumber, invoiceDate, dueDate, items, note, tnc, paymentConfiguration, signature } =
    useCreateOutgoingInvoiceProvider();
  const { config, loading } = useGetNotificationConfig();

  const availableChannels = useMemo(() => {
    if (!config || loading) return [];
    return config.channels.filter((channel) => channel.enabled).map((channel) => channel.channel);
  }, [config, loading]);

  const onSendClick = async (channels: NotificationChannel[]) => {
    if (!trigger) return;
    if (!recipient) return;
    if (!invoiceNumber) return;
    if (!invoiceDate) return;
    if (!dueDate) return;
    if (!items) return;
    if (!paymentConfiguration) return;

    const invoice = await trigger({
      recipient: recipient,
      invoiceNumber: invoiceNumber,
      invoiceDate: invoiceDate,
      dueDate: dueDate,
      items: items,
      note: note,
      tnc: tnc,
      paymentConfiguration: paymentConfiguration,
      signature: signature === null ? undefined : signature,
      sendChannel: channels,
    });

    if (props.onCompleted) await props.onCompleted(invoice);
  };

  if (!recipient) return null;
  return (
    <SendOptionsDialog
      open={props.open}
      onClose={props.onClose}
      recipient={recipient}
      onSendClick={onSendClick}
      availableChannels={availableChannels}
    />
  );
}
