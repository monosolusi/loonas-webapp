"use client";

import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import React, { useMemo, useState } from "react";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { useCreateOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-create-outgoing-invoice";
import { useCreateOutgoingInvoice as useCreateOutgoingInvoiceProvider } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { InvoiceSendChannel } from "@/features/invoice/domain/enums/invoice-send-channel";
import { SendViaEmailCheckbox } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/send-via-email-checkbox";
import { SendViaWhatsappCheckbox } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/send-via-whatsapp-checkbox";

interface SendOptionsDialogProps {
  open: boolean;
  onClose?: () => void;
  onCompleted?: (item: OutgoingInvoiceEntity) => void | Promise<void>;
}

export function SendOptionsDialog(props: SendOptionsDialogProps) {
  const [sendEmail, setSendEmail] = useState<boolean>(false);
  const [sendWhatsApp, setSendWhatsApp] = useState<boolean>(false);
  const { trigger, isMutating } = useCreateOutgoingInvoice();
  const { recipient, invoiceNumber, invoiceDate, dueDate, items, note, tnc, paymentConfiguration, signature } =
    useCreateOutgoingInvoiceProvider();

  const isSendDisabled = useMemo(() => {
    return !sendEmail && !sendWhatsApp;
  }, [sendEmail, sendWhatsApp]);

  const handleSendClick = async () => {
    if (isSendDisabled) return;
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
      sendChannel: [
        ...(sendEmail ? [InvoiceSendChannel.EMAIL] : []),
        ...(sendWhatsApp ? [InvoiceSendChannel.WHATSAPP] : []),
      ],
    });

    if (props.onCompleted) await props.onCompleted(invoice);
  };

  const handleCancelClick = () => {
    if (!props.onClose) return;
    setSendEmail(false);
    setSendWhatsApp(false);
    props.onClose();
  };

  if (!recipient) return null;
  return (
    <LoonasDialog title="Pilih Metode Pengiriman Faktur" open={props.open} onClose={props.onClose} allowDismiss={false}>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-1">
          <div className="text-sm text-gray-500">
            Kirim faktur secara instan ke pelanggan melalui saluran yang paling sesuai. Pastikan informasi kontak sudah
            benar sebelum melanjutkan.
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <SendViaEmailCheckbox
            checked={sendEmail}
            onChange={(checked) => setSendEmail(checked)}
            disabled={isMutating}
            recipient={recipient}
          />
          <SendViaWhatsappCheckbox
            checked={sendWhatsApp}
            onChange={(checked) => setSendWhatsApp(checked)}
            disabled={isMutating}
            recipient={recipient}
          />
        </div>
        <div className="flex flex-row justify-end space-x-2">
          <OutlinedButton onClick={handleCancelClick} disabled={isMutating}>
            Batal
          </OutlinedButton>
          <FilledButton onClick={handleSendClick} disabled={isSendDisabled} loading={isMutating}>
            Kirim Faktur
          </FilledButton>
        </div>
      </div>
    </LoonasDialog>
  );
}
