import React, { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { TextInput } from "@/core/presentations/components/text-input";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { ErrorCard } from "@/core/presentations/components/error-card";
import { useBankAccount } from "@/features/bank/presentation/providers/bank-account";
import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { BankEntity } from "@/features/bank/domain/entities/bank";
import { BankCombobox } from "@/app/(authenticated)/invoices/incoming/create/@banks/_components/bank-combobox";
import { AccountInquiryResultEntity } from "@/features/bank/domain/entities/account-inquiry-result";

export function NewBankAccountDialog({ open, setOpen, onCreated }: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  onCreated?: () => Promise<void>
}) {
  const { receiver } = useCreateIncomingInvoice();
  const {
    verifyAccountHolder,
    createBankAccount,
    error,
    verifying,
    creating
  } = useBankAccount();


  const [selectedBank, setSelectedBank] = useState<BankEntity | null>(null);
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [verified, setVerified] = useState<boolean>(false);
  const [inquiredAccount, setInquiredAccount] = useState<AccountInquiryResultEntity>();

  async function handleVerify() {
    if (!selectedBank || !accountNumber) return;

    const inquiryResult = await verifyAccountHolder?.(selectedBank.id, accountNumber);
    if (!inquiryResult) return;
    setInquiredAccount(inquiryResult);
    setVerified(true);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!selectedBank || !accountNumber || !inquiredAccount || !receiver) return;
    const isCreated = await createBankAccount?.(
      selectedBank.id,
      accountNumber,
      inquiredAccount.accountHolderName,
      receiver.id
    );

    if (!isCreated) return;
    await onCreated?.();
    resetForm();
  }

  function resetForm() {
    setSelectedBank(null);
    setAccountNumber("");
    setVerified(false);
  }

  // Clear form when the dialog is closed
  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

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
                  Tambah Rekening Baru
                </DialogTitle>
                {error && <ErrorCard>{error.message}</ErrorCard>}
                <div className="my-4">
                  <div className="flex flex-col gap-y-2">
                    <div className="mb-2">
                      <BankCombobox selectedBank={selectedBank} setSelectedBank={setSelectedBank} />
                    </div>

                    <TextInput
                      title="Nomor Rekening"
                      className="flex-1"
                      value={accountNumber}
                      onChange={setAccountNumber}
                      type="text"
                      inputMode="numeric"
                      placeholder="Cth. 1234567890"
                      required
                      disabled={verified}
                    />

                    {!verified && (
                      <div className="mt-2">
                        <FilledButton
                          type="button"
                          onClick={handleVerify}
                          disabled={!selectedBank || !accountNumber || verifying}
                          className="w-full"
                        >
                          {verifying ? "Memverifikasi..." : "Verifikasi Rekening"}
                        </FilledButton>
                      </div>
                    )}

                    {verified && inquiredAccount && (
                      <div className="mt-2">
                        <label className="block text-sm font-medium text-gray-700">
                          Nama Pemilik Rekening
                        </label>
                        <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                          {inquiredAccount.accountHolderName}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              {verified && inquiredAccount && (
                <div className="ml-3">
                  <FilledButton disabled={creating}>
                    {creating ? "Menyimpan..." : "Buat Rekening Baru"}
                  </FilledButton>
                </div>
              )}
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