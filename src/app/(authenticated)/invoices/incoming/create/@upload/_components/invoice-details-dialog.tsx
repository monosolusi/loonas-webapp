"use client";

import React, { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { InvoiceDocument } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { TextInput } from "@/core/presentations/components/text-input";

interface InvoiceDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (details: Omit<InvoiceDocument, "file">) => void;
}

export function InvoiceDetailsDialog({ isOpen, onClose, onSubmit }: InvoiceDetailsDialogProps) {
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [formattedAmount, setFormattedAmount] = useState<string>("");
  const [dueDate, setDueDate] = useState("");

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
    if (amount) {
      setFormattedAmount(formatCurrency(amount));
    }
  }, [amount]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      invoiceNumber,
      amount: parseCurrency(formattedAmount),
      dueDate
    });
    resetForm();
  };

  const resetForm = () => {
    setInvoiceNumber("");
    setAmount("");
    setFormattedAmount("");
    setDueDate("");
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel
                className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Detail Faktur
                </Dialog.Title>
                <form onSubmit={handleSubmit}>
                  <div className="mt-4">
                    <TextInput
                      title="Nomor Faktur"
                      htmlFor="invoice-number"
                      type="text"
                      value={invoiceNumber}
                      onChange={setInvoiceNumber}
                    />
                  </div>

                  <div className="mt-4">
                    <TextInput
                      title="Jumlah"
                      htmlFor="amount"
                      type="text"
                      value={formattedAmount}
                      onChange={handleAmountChange}
                      placeholder="Rp"
                      required
                    />
                  </div>

                  <div className="mt-4">
                    <TextInput
                      title="Tanggal Jatuh Tempo"
                      htmlFor="due-date"
                      type="date"
                      value={dueDate}
                      onChange={setDueDate}
                      required
                    />
                  </div>

                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary-default focus:ring-offset-2"
                      onClick={onClose}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="inline-flex justify-center rounded-md border border-transparent bg-primary-default px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-primary-default focus:ring-offset-2"
                    >
                      Simpan
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}