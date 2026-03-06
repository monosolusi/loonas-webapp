"use client";

import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import React, { useMemo, useState } from "react";
import { SendViaEmailCheckbox } from "@/app/(authenticated)/invoices/_components/send-via-email-checkbox";
import { SendViaWhatsappCheckbox } from "@/app/(authenticated)/invoices/_components/send-via-whatsapp-checkbox";
import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";

interface SendOptionsDialogProps {
  open: boolean;
  onClose?: () => void;
  recipient: { email?: string; phoneNumber?: string; name: string };
  onSendClick?: (channels: NotificationChannel[]) => Promise<void>;
  availableChannels: NotificationChannel[];
}

export function SendOptionsDialog(props: SendOptionsDialogProps) {
  const [sendEmail, setSendEmail] = useState<boolean>(false);
  const [sendWhatsApp, setSendWhatsApp] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const isSendDisabled = useMemo(() => {
    return !sendEmail && !sendWhatsApp;
  }, [sendEmail, sendWhatsApp]);

  const onSendClick = async () => {
    setIsLoading(true);
    if (props.onSendClick) {
      const channels = [
        ...(!sendEmail ? [] : [NotificationChannel.EMAIL]),
        ...(!sendWhatsApp ? [] : [NotificationChannel.WHATSAPP]),
      ];

      await props.onSendClick(channels);
    }

    setIsLoading(false);
  };

  const onCancelClick = () => {
    if (!props.onClose) return;
    setSendEmail(false);
    setSendWhatsApp(false);
    props.onClose();
  };

  return (
    <LoonasDialog title="Pilih Metode Pengiriman Faktur" open={props.open} onClose={props.onClose} allowDismiss={false}>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-1">
          <div className="text-sm text-neutral-300">
            Kirim faktur secara instan ke pelanggan melalui saluran yang paling sesuai. Pastikan informasi kontak sudah
            benar sebelum melanjutkan.
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <SendViaEmailCheckbox
            checked={sendEmail}
            onChange={(checked) => setSendEmail(checked)}
            disabled={isLoading}
            recipient={props.recipient}
            isAvailable={props.availableChannels.includes(NotificationChannel.EMAIL)}
          />
          <SendViaWhatsappCheckbox
            checked={sendWhatsApp}
            onChange={(checked) => setSendWhatsApp(checked)}
            disabled={isLoading}
            recipient={props.recipient}
            isAvailable={props.availableChannels.includes(NotificationChannel.WHATSAPP)}
          />
        </div>
        <div className="flex flex-row justify-end gap-2">
          <SecondaryButton outlined label="Batal" onClick={onCancelClick} disabled={isLoading} className="w-auto" />
          <PrimaryButton
            label="Kirim Faktur"
            onClick={onSendClick}
            disabled={isSendDisabled}
            loading={isLoading}
            className="w-auto"
          />
        </div>
      </div>
    </LoonasDialog>
  );
}
