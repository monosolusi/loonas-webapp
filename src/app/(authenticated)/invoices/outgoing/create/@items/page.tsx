"use client";

import React from "react";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { InvoiceNumberInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/invoice-number-input";
import { InvoiceDateInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/invoice-date-input";
import { InvoiceDueDateInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/invoice-due-date-input";
import { ItemTableImpl } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/item-table-impl";
import { NoteInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/note-input";
import { TermAndConditionInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/term-and-condition-input";
import { SignatureInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/signature-input";
import { DemoButton } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/demo-button";

export default function ItemsSection() {
  const { currentStep, recipient } = useCreateOutgoingInvoice();
  if (currentStep !== "invoice-details") return null;
  return (
    <div className="flex flex-col gap-y-10">
      <DemoButton />

      {/* Section 1: Data Faktur */}
      <section className="flex flex-col gap-y-4 border-b border-neutral-100 pb-10">
        <div>
          <h2 className="text-base font-semibold text-neutral-500">Data Faktur</h2>
          <p className="text-sm text-neutral-300">
            Masukkan data dasar faktur untuk pencatatan dan pelacakan yang akurat.
          </p>
        </div>
        <div className="flex flex-col gap-y-4">
          <InvoiceNumberInput />
          <div className="grid grid-cols-2 gap-x-4">
            <InvoiceDateInput />
            <InvoiceDueDateInput />
          </div>
        </div>
      </section>

      {/* Section 2: Item Faktur */}
      <section className="flex flex-col gap-y-4 border-b border-neutral-100 pb-10">
        <div>
          <h2 className="text-base font-semibold text-neutral-500">Item Faktur</h2>
          <p className="text-sm text-neutral-300">
            Tambahkan item dalam invoice Anda untuk&nbsp;
            <span className="font-bold text-neutral-500 underline">{recipient?.name}</span> secara detail.
          </p>
        </div>
        <ItemTableImpl />
      </section>

      {/* Section 3: Informasi Tambahan */}
      <section className="flex flex-col gap-y-4">
        <div>
          <h2 className="text-base font-semibold text-neutral-500">Informasi Tambahan</h2>
          <p className="text-sm text-neutral-300">Tambahkan catatan, syarat & ketentuan, dan tanda tangan untuk invoice.</p>
        </div>
        <div className="flex flex-col gap-y-4">
          <NoteInput />
          <TermAndConditionInput />
          <SignatureInput />
        </div>
      </section>
    </div>
  );
}
