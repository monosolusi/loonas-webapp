"use client";

import React from "react";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { Card } from "@/core/presentations/components/card";
import { InvoiceNumberInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/invoice-number-input";
import { InvoiceDateInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/invoice-date-input";
import { InvoiceDueDateInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/invoice-due-date-input";
import { ItemTableImpl } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/item-table-impl";
import { HeaderAddItemButton } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/header-add-item-button";
import { NoteInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/note-input";
import { TermAndConditionInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/term-and-condition-input";
import { SignatureInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/signature-input";
import { NextStepButton } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/next-step-button";
import { DemoButton } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/demo-button";

const ITEMS_SECTION_STEP = 1;

export default function ItemsSection() {
  const { currentStep, recipient } = useCreateOutgoingInvoice();
  if (currentStep !== ITEMS_SECTION_STEP) return null;
  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row justify-between">
          <div className="flex flex-1 flex-col">
            <h1 className="text-base font-semibold text-gray-900">Item dalam Invoice</h1>
            <p className="text-sm text-gray-500">
              Tambahkan item dalam invoice Anda untuk&nbsp;
              <span className="font-bold text-gray-700 underline">{recipient?.name}</span> secara detail.
            </p>
          </div>
          <div className="flex flex-1 flex-row justify-end space-x-2 self-end">
            <DemoButton />
            <HeaderAddItemButton />
          </div>
        </div>
        <div className="mt-4 flex-1">
          <Card>
            <div className="flex flex-col space-y-4">
              <div>
                <h1 className="text-base font-semibold text-gray-900">Data Faktur</h1>
                <p className="text-sm text-gray-500">
                  Masukkan data dasar faktur untuk pencatatan dan pelacakan yang akurat.
                </p>
              </div>
              <div className="flex flex-row justify-between space-x-4">
                <div className="flex-1">
                  <InvoiceNumberInput />
                </div>
                <div className="flex-1">
                  <InvoiceDateInput />
                </div>
                <div className="flex-1">
                  <InvoiceDueDateInput />
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="mt-4 flex-1">
          <ItemTableImpl />
        </div>
        <div className="mt-4 flex-1">
          <Card>
            <div className="flex flex-row space-x-4">
              <div className="flex-1 flex-col space-y-4">
                <div className="flex-1">
                  <NoteInput />
                </div>
                <div className="flex-1">
                  <TermAndConditionInput />
                </div>
              </div>
              <div className="flex-1">
                <SignatureInput />
              </div>
            </div>
          </Card>
        </div>
        <div className="mt-4 flex flex-1 flex-row justify-end gap-x-4">
          <SecondaryButton outlined label="Simpan Draft" />
          <NextStepButton />
        </div>
      </div>
    </>
  );
}
