"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { TextInput } from "@/core/presentations/components/text-input";

interface InvoiceDetailsDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFile?: File | null;
}

export function InvoiceDetailsDialog({ open, setOpen, selectedFile }: InvoiceDetailsDialogProps) {
  const { addInvoiceDocument } = useCreateIncomingInvoice();

  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [formattedAmount, setFormattedAmount] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");

  // Format number to Indonesian Rupiah
  const formatCurrency = (value: string): string => {
    // Remove non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");

    if (!numericValue) return "";

    // Format as currency
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });

    return formatter.format(parseInt(numericValue));
  };

  // Parse formatted currency back to number
  const parseCurrency = (value: string): number => {
    // Remove currency symbol, dots, and other non-numeric characters
    const numericValue = value.replace(/[^0-9]/g, "");
    return numericValue ? parseInt(numericValue) : 0;
  };

  // Handle amount change
  const handleAmountChange = (value: string) => {
    // Store raw value for internal use
    setAmount(value);

    // Format and display
    const formatted = formatCurrency(value);
    setFormattedAmount(formatted);
  };

  // Format amount when component mounts or amount changes
  useEffect(() => {
    if (amount) setFormattedAmount(formatCurrency(amount));
  }, [amount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    addInvoiceDocument?.({
      file: selectedFile,
      invoiceNumber: invoiceNumber,
      amount: parseCurrency(formattedAmount),
      dueDate: dueDate
    });

    resetForm();
    setOpen(false);
  };

  const resetForm = () => {
    setInvoiceNumber("");
    setAmount("");
    setFormattedAmount("");
    setDueDate("");
  };

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
                  Detail Faktur
                </DialogTitle>
                <div className="my-4">
                  <div className="flex flex-col gap-y-2">
                    <TextInput
                      title="Nomor Faktur (Optional)"
                      value={invoiceNumber}
                      onChange={setInvoiceNumber}
                      placeholder="Cth. FAK-0001"
                    />
                    <TextInput
                      title="Jumlah"
                      htmlFor="amount"
                      type="text"
                      value={formattedAmount}
                      onChange={handleAmountChange}
                      placeholder="Rp"
                      required
                    />
                    <TextInput
                      title="Tanggal Jatuh Tempo"
                      htmlFor="due-date"
                      type="date"
                      value={dueDate}
                      onChange={setDueDate}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <div className="ml-3">
                <FilledButton>
                  Simpan
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