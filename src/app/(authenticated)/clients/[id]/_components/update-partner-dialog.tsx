import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ErrorCard } from "@/core/presentations/components/error-card";
import { TextInput } from "@/core/presentations/components/text-input";
import { EmailInput } from "@/core/presentations/components/email-input";
import { FilledButton } from "@/core/presentations/components/filled-button";
import React from "react";
import { ServerError } from "@/core/resources/server-error";
import { isValidPhoneNumber, parsePhoneNumberFromString } from "libphonenumber-js";

export interface PartnerExistingDataItem {
  name: string;
  email: string;
  phone: string;
}

interface OnSubmitParams {
  name: string;
  email: string;
  phone: string;
}

interface UpdatePartnerDialogProps {
  open: boolean;
  onClose?: () => void;
  onSubmit?: ((params: OnSubmitParams) => void) | ((params: OnSubmitParams) => Promise<void>);
  onCancel?: () => void;
  error?: ServerError;
  existingData: PartnerExistingDataItem;
}

export function UpdatePartnerDialog(props: UpdatePartnerDialogProps) {
  const [name, setName] = React.useState<string>(props.existingData.name);
  const [email, setEmail] = React.useState<string>(props.existingData.email);
  const [phone, setPhone] = React.useState<string>(props.existingData.phone);

  const handleClose = (value: boolean) => {
    props.onClose?.();
  };

  const handleCancel = (e: React.MouseEvent) => {
    props.onCancel?.();
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    try {
      e.preventDefault();

      if (!name || !email || !phone) return;
      if (!isValidEmail(email)) return;

      // This block will check the phone number validity
      const phoneNumber = phone.startsWith("+62") ? phone : `+62${phone.replace(/^0+/, "")}`;
      if (!isValidPhoneNumber(phoneNumber, "ID")) return;
      const formattedPhone = parsePhoneNumberFromString(phoneNumber, "ID")?.format("E.164");
      if (!formattedPhone) return;

      props.onSubmit?.({ name, email, phone: formattedPhone });
    } catch {
      return;
    }
  };

  return (
    <Dialog as="form" open={props.open} onClose={handleClose} className="relative z-50" onSubmit={handleSubmit}>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 w-full sm:max-w-sm sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="sm:flex sm:items-start">
              <div className="flex-1 mt-3 sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                  Perbarui Klien
                </DialogTitle>
                {props.error && <ErrorCard>{props.error.message}</ErrorCard>}
                <div className="my-4">
                  <div className="flex flex-col gap-y-2">
                    <TextInput
                      title="Nama"
                      className="flex-1"
                      value={name}
                      onChange={setName}
                      placeholder="Cth. PT. Suplier Keren Kamu"
                      required
                    />
                    <EmailInput
                      className="flex-1"
                      value={email}
                      onChange={setEmail}
                      placeholder="Cth. contoh@suplier.com"
                      required
                    />
                    <TextInput
                      title="Nomor Telpon"
                      className="flex-1"
                      value={phone}
                      onChange={setPhone}
                      type="tel"
                      inputMode="numeric"
                      maxLength={20}
                      placeholder="Cth. 081234567890"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <div className="ml-3">
                <FilledButton>
                  Perbarui Klien
                </FilledButton>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
              >
                Batalkan
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
