"use client";

import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { FilledButton } from "@/core/presentations/components/filled-button";
import {
  DisclaimerCheckbox
} from "@/app/(authenticated)/invoices/incoming/create/@upload/_components/disclaimer-checkbox";

interface DisclaimerDialogProps {
  open: boolean;
  onClose: (value: boolean) => void;
  onConfirm: () => void;
  loading?: boolean;
}

interface CheckboxItem {
  id: string;
  checked: boolean;
  description: string;
}

export function DisclaimerDialog({ open, onClose, onConfirm, loading }: DisclaimerDialogProps) {
  const [checkboxes, setCheckboxes] = useState<CheckboxItem[]>([
    {
      id: "statement-1",
      checked: false,
      description: "Saya dengan ini menyatakan bahwa faktur dan/atau dokumen yang telah saya unggah adalah benar, akurat, dan sesuai dengan kondisi sebenarnya."
    },
    {
      id: "statement-2",
      checked: false,
      description: "Saya memahami dan menyetujui bahwa Loonas tidak bertanggung jawab atas setiap kesalahan, ketidaksesuaian, atau informasi yang menyesatkan yang terdapat dalam dokumen yang saya unggah."
    },
    {
      id: "statement-3",
      checked: false,
      description: "Dengan ini saya membebaskan dan melepaskan Loonas dari segala bentuk tanggung jawab, tuntutan, gugatan, dan/atau klaim dari pihak mana pun atas akibat yang timbul dari isi dan/atau penggunaan dokumen tersebut."
    }
  ]);

  const allChecked = checkboxes.every(checkbox => checkbox.checked);

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setCheckboxes(prev => prev.map(checkbox =>
      checkbox.id === id ? { ...checkbox, checked } : checkbox
    ));
  };

  return (
    <Dialog
      onClose={onClose}
      open={open}
      className="relative z-10"
    >
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
                <div
                  className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:size-10"
                >
                  <ExclamationTriangleIcon aria-hidden="true" className="size-6 text-yellow-600" />
                </div>
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                  <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                    Konfirmasi Dokumen
                  </DialogTitle>
                  <div className="mt-4 space-y-4">
                    {checkboxes.map((checkbox) => (
                      <DisclaimerCheckbox
                        key={checkbox.id}
                        checked={checkbox.checked}
                        onChange={(checked) => handleCheckboxChange(checkbox.id, checked)}
                        description={checkbox.description}
                      />
                    ))}

                    <div className="mt-4">
                      <p className="text-sm text-black">
                        Pernyataan ini berlaku sebagai bentuk pengesahan pengguna atas kebenaran dokumen yang diserahkan
                        dan menjadi bagian yang tidak terpisahkan dari Syarat dan Ketentuan Loonas.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-6 sm:grid sm:grid-flow-row-dense sm:grid-cols-2 sm:gap-3">
              <div className="sm:col-start-2">
                <FilledButton
                  type="button"
                  loading={loading}
                  onClick={onConfirm}
                  disabled={!allChecked}
                >
                  Setuju & Lanjutkan
                </FilledButton>
              </div>
              <button
                type="button"
                onClick={() => onClose(false)}
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50 sm:col-start-1 sm:mt-0"
              >
                Kembali
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}