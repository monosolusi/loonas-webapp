"use client";

import { useCreateIncomingInvoiceSteps } from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import Image from "next/image";
import { useCreateIncomingInvoiceProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { IncomingInvoiceDocumentInput } from "@/features/invoice/presentations/components/incoming-invoice-document-input";
import { InvoiceDocument } from "@/features/invoice/presentations/providers/create-incoming-invoice.types";
import { useMemo } from "react";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";

export default function InvoiceDetailPage() {
  const { currentStep } = useCreateIncomingInvoiceSteps();
  const { invoices, setInvoices, addInvoiceDocument, canAddInvoiceDocument } = useCreateIncomingInvoiceProvider();

  const totalAmount = useMemo(() => {
    return invoices.reduce((acc, curr) => acc + curr.amount, 0);
  }, [invoices]);

  if (currentStep !== "invoices") return null;
  return (
    <div className="flex flex-col items-start gap-y-6">
      {/* Title */}
      <div className="text-xl leading-7 font-bold">Detail Tagihan</div>

      {/* Total Summary */}
      <div className="border-primary-100 bg-primary-50 flex min-w-[250px] flex-col gap-y-1 rounded-lg border px-4 py-3">
        <div className="text-xs leading-4 font-semibold tracking-wide uppercase">Total Nominal</div>
        <div className="text-xl leading-7 font-bold">Rp {IDRFormatter.toThousand(totalAmount)}</div>
      </div>

      {/*  Invoice Items */}
      <div className="flex flex-col gap-y-6 self-stretch">
        {invoices.map((invoice, index) => {
          const onDelete = () => {
            setInvoices?.((prev) => prev.filter((_, i) => i !== index));
          };

          const onChange = (newInvoice: InvoiceDocument) => {
            setInvoices?.((prev) => {
              prev[index] = newInvoice;
              return [...prev];
            });
          };

          return (
            <IncomingInvoiceDocumentInput
              key={index}
              index={index}
              invoice={invoice}
              showDelete={invoices.length > 1}
              onDelete={onDelete}
              onChange={onChange}
            />
          );
        })}

        {/*  Add Item */}
        {canAddInvoiceDocument && (
          <div
            className="hover:bg-primary-50 flex cursor-pointer flex-col items-center justify-center gap-y-2 rounded-md border border-dashed border-neutral-300 py-8 transition-colors duration-200 ease-out select-none"
            onClick={addInvoiceDocument}
          >
            <div className="flex size-10 flex-col items-center justify-center rounded-full border border-neutral-500 bg-white">
              <Image src="/assets/images/plus-icon-neutral-500-w24-h24.svg" alt="add item" width={24} height={24} />
            </div>
            <div className="text-sm leading-5 font-semibold">Tambah Faktur Lain</div>
          </div>
        )}
      </div>
    </div>
  );
}
