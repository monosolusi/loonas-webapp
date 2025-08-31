"use client";

import React from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ErrorCard } from "@/core/presentations/components/error-card";
import { TextInput } from "@/core/presentations/components/text-input";
import { EmailInput } from "@/core/presentations/components/email-input";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { useCreatePartner } from "@/features/partner/presentation/hooks/use-create-partner";

interface NewClientDialogProps {
  open: boolean;
  onClose?: () => void;
  onCreated?: () => void | Promise<void>;
}

export function NewClientDialog(props: NewClientDialogProps) {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const { trigger, isMutating, error } = useCreatePartner();

  const clearInput = () => {
    setName("");
    setEmail("");
    setPhoneNumber("");
  };

  const handleClose = (value: boolean) => {
    props.onClose?.();
  };

  const handleCancelClick = () => {
    clearInput();
    props.onClose?.();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !email || !phoneNumber) return;
    await trigger({ name, email, phoneNumber });
    if (props.onCreated) await props.onCreated();
    clearInput();
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
            className="relative w-full transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:max-w-sm sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
          >
            <div className="sm:flex sm:items-start">
              <div className="mt-3 flex-1 sm:mt-0 sm:ml-4 sm:text-left">
                <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                  Buat Klien Baru
                </DialogTitle>
                {error && <ErrorCard>{error.message}</ErrorCard>}
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
                      value={phoneNumber}
                      onChange={setPhoneNumber}
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
                <FilledButton disabled={isMutating}>Buat Klien Baru</FilledButton>
              </div>
              <button
                type="button"
                onClick={handleCancelClick}
                disabled={isMutating}
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
