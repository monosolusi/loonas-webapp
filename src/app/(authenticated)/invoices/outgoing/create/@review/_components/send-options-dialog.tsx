import { LoonasCheckbox } from "@/core/presentations/components/loonas-checkbox";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import React, { useMemo, useState } from "react";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { FilledButton } from "@/core/presentations/components/filled-button";

interface SendOptionsDialogProps {
  open: boolean;
  onClose?: () => void;
}

export function SendOptionsDialog(props: SendOptionsDialogProps) {
  const [sendEmail, setSendEmail] = useState<boolean>(false);
  const [sendWhatsApp, setSendWhatsApp] = useState<boolean>(false);

  const isSendDisabled = useMemo(() => {
    return !sendEmail && !sendWhatsApp;
  }, [sendEmail, sendWhatsApp]);

  const handleSendClick = () => {
    if (!isSendDisabled) return;
  };

  const handleCancelClick = () => {
    if (!props.onClose) return;
    setSendEmail(false);
    setSendWhatsApp(false);
    props.onClose();
  };

  return (
    <LoonasDialog title="Pilih Metode Pengiriman Faktur" open={props.open} onClose={props.onClose}>
      <div className="flex flex-col space-y-8">
        <div className="flex flex-col space-y-1">
          <div className="text-sm text-gray-500">
            Kirim faktur secara instan ke pelanggan melalui saluran yang paling sesuai. Pastikan informasi kontak sudah
            benar sebelum melanjutkan.
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          <LoonasCheckbox checked={sendEmail} onChange={(checked) => setSendEmail(checked)}>
            <div className="flex flex-col space-y-1">
              <div className="text-base font-semibold text-gray-900">Kirim Email</div>
              <div className="text-sm text-gray-500">
                Faktur akan dikirimkan ke <span className="underline">halo@monosolusi.com</span> dan{" "}
                <span className="underline">PT. Mono Solusi Indonesia</span> dapat membayar melalui link yang akan
                dkirimkan via email.
              </div>
            </div>
          </LoonasCheckbox>
          <LoonasCheckbox checked={sendWhatsApp} onChange={(checked) => setSendWhatsApp(checked)}>
            <div className="flex flex-col space-y-1">
              <div className="text-base font-semibold text-gray-900">Kirim WhatsApp</div>
              <div className="text-sm text-gray-500">
                Faktur akan dikirimkan ke <span className="underline">+62812345678</span> dan{" "}
                <span className="underline">PT. Mono Solusi Indonesia</span> dapat membayar melalui link yang akan
                dkirimkan via WhatsApp.
              </div>
            </div>
          </LoonasCheckbox>
        </div>
        <div className="flex flex-row justify-end space-x-2">
          <OutlinedButton onClick={handleCancelClick}>Batal</OutlinedButton>
          <FilledButton onClick={handleSendClick} disabled={isSendDisabled}>
            Kirim Faktur
          </FilledButton>
        </div>
      </div>
    </LoonasDialog>
  );
}
