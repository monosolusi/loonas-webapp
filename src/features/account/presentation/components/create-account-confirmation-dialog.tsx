"use client";

import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { FilledButton } from "@/core/presentations/components/filled-button";
import React from "react";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

interface CreateAccountConfirmationDialogProps {
  open: boolean;
  onConfirm?: () => Promise<void> | void;
  onCloseClick?: () => Promise<void> | void;
  loading?: boolean;
}

export function CreateAccountConfirmationDialog(props: CreateAccountConfirmationDialogProps) {
  return (
    <Dialog onClose={() => {}} open={props.open} className="relative z-10">
      <DialogBackdrop
        className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
        transition
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-closed:sm:translate-y-0 data-closed:sm:scale-95"
            transition
          >
            <div className="mt-3 text-center sm:mt-5">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:size-10">
                  <SparklesIcon aria-hidden="true" className="size-6 text-yellow-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                    Cek Lagi, Yuk!
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Sebelum lanjut, pastikan data yang kamu masukkan sudah benar. Dengan melanjutkan, berarti kamu
                      setuju dengan{" "}
                      <a className="inline-text text-primary-default text-bold" href="#">
                        Syarat & Ketentuan
                      </a>{" "}
                      serta{" "}
                      <a className="inline-text text-primary-default text-bold" href="#">
                        kebijakan privasi
                      </a>{" "}
                      yang berlaku. Tekan 'Setuju & Lanjutkan' untuk lanjut ke tahap berikutnya!
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <div className="sm:col-start-2">
                <FilledButton type="button" loading={props.loading} onClick={props.onConfirm}>
                  Setuju & Lanjutkan
                </FilledButton>
              </div>
              <SecondaryButton outlined type="button" label="Cek Lagi" onClick={props.onCloseClick} disabled={props.loading} />
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
