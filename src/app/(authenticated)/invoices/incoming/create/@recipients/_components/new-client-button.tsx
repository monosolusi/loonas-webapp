"use client";

import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { TextInput } from "@/core/presentations/components/text-input";
import { EmailInput } from "@/core/presentations/components/email-input";

export function NewClientButton() {
  const [open, setOpen] = useState(false);

  function handleNewClientClick() {
    setOpen(true);
  }

  return (
    <>
      <FilledButton onClick={handleNewClientClick}>
        Buat Klien Baru
      </FilledButton>
      <Dialog open={open} onClose={setOpen} className="relative z-50">
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
                  <div className="my-4">
                    <div className="flex flex-col gap-y-2">
                      <TextInput title="Nama" className="flex-1" />
                      <EmailInput className="flex-1" />
                      <TextInput title="Nomor Telpon" className="flex-1" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex w-full justify-center rounded-md bg-primary-default px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-primary-500 sm:ml-3 sm:w-auto"
                >
                  Buat Klien Baru
                </button>
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
    </>
  );
}