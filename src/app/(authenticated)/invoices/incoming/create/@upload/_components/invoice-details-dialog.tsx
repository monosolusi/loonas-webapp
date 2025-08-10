"use client";

import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { TextInput } from "@/core/presentations/components/text-input";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { DateTime } from "luxon";
import { ServerError } from "@/core/resources/server-error";
import { ErrorCard } from "@/core/presentations/components/error-card";
import { DateInput } from "@/core/presentations/components/date-input";

export type InvoiceDetailsDialogOnSubmitParams = {
  invoiceNumber: string;
  amount: number;
  dueDate: DateTime;
  invoiceDate: DateTime;
  note: string;
};

interface InvoiceDetailsDialogProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onSubmit: (params: InvoiceDetailsDialogOnSubmitParams) => boolean;
  onCancel?: () => void;
  error?: ServerError;
}

export function InvoiceDetailsDialog(props: InvoiceDetailsDialogProps) {
  const [invoiceNumber, setInvoiceNumber] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [dueDate, setDueDate] = useState<DateTime>(DateTime.now());
  const [invoiceDate, setInvoiceDate] = useState<DateTime>(DateTime.now());
  const [note, setNote] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isSuccess = props.onSubmit({
      invoiceNumber: invoiceNumber,
      amount: IDRFormatter.toNumber(amount),
      dueDate: dueDate,
      invoiceDate: invoiceDate,
      note: note,
    });

    if (!isSuccess) return;

    resetForm();
    props.setOpen(false);
  };

  const handleAmountChange = (value: string) => {
    setAmount(IDRFormatter.toNumber(value).toString());
  };

  const handleCancelClick = () => {
    if (props.onCancel) props.onCancel();
    resetForm();
  };

  const resetForm = () => {
    setInvoiceNumber("");
    setAmount("");
    setDueDate(DateTime.now());
    setInvoiceDate(DateTime.now());
    setNote("");
  };

  return (
    <Dialog as="form" open={props.open} onClose={props.setOpen} className="relative z-50" onSubmit={handleSubmit}>
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
                  Detail Faktur
                </DialogTitle>
                {props.error && <ErrorCard>{props.error.message}</ErrorCard>}
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
                      value={IDRFormatter.toCurrency(amount)}
                      onChange={handleAmountChange}
                      placeholder="Rp"
                      required
                    />
                    <DateInput
                      title="Tanggal Faktur"
                      htmlFor="invoice-date"
                      value={invoiceDate}
                      onChange={setInvoiceDate}
                      required
                    />
                    <DateInput
                      title="Tanggal Jatuh Tempo"
                      htmlFor="due-date"
                      value={dueDate}
                      onChange={setDueDate}
                      required
                    />
                    <TextInput title="Catatan (Optional)" value={note} onChange={setNote} />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <div className="ml-3">
                <FilledButton>Simpan</FilledButton>
              </div>
              <button
                type="button"
                onClick={handleCancelClick}
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
