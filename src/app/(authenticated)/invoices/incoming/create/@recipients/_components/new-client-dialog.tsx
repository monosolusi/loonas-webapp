import React from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { TextInput } from "@/core/presentations/components/text-input";
import { EmailInput } from "@/core/presentations/components/email-input";
import { useCreateNewPartner } from "@/features/partner/presentation/providers/create-new-partner";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { ErrorCard } from "@/core/presentations/components/error-card";

export function NewClientDialog({ open, setOpen, onCreated }: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  onCreated?: () => Promise<void>
}) {
  const {
    createPartner,
    name,
    email,
    phone,
    error,
    clearError,
    clearInput,
    setName,
    setEmail,
    setPhone
  } = useCreateNewPartner();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Clear any previous errors
    if (error) clearError?.();

    const isSuccess = await createPartner?.();
    if (!isSuccess) return;

    await onCreated?.();
    setOpen(false);
  }

  // Clear error when dialog is closed
  React.useEffect(() => {
    if (!open && error) {
      clearError?.();
      clearInput?.();
    }
  }, [open, error, clearError, clearInput]);

  return (
    <Dialog as="form" open={open} onClose={setOpen} className="relative z-50" onSubmit={handleSubmit}>
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
                  Buat Klien Baru
                </FilledButton>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
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