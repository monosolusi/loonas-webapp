"use client";

import React from "react";
import {
  useCreateOutgoingInvoice
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { Card } from "@/core/presentations/components/card";
import { PhotoIcon } from "@heroicons/react/24/solid";
import {
  InvoiceNumberInput
} from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/invoice-number-input";
import { InvoiceDateInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/invoice-date-input";
import {
  InvoiceDueDateInput
} from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/invoice-due-date-input";
import { ItemTableImpl } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/item-table-impl";
import {
  HeaderAddItemButton
} from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/header-add-item-button";

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
              <span className="underline text-gray-700 font-bold">{recipient?.name}</span> secara detail.
            </p>
          </div>
          <div className="flex-1 flex justify-end self-end">
            <HeaderAddItemButton />
          </div>
        </div>
        <div className="flex-1 mt-4">
          <Card>
            <div className="flex flex-col space-y-4">
              <div>
                <h1 className="text-base font-semibold text-gray-900">Data Faktur</h1>
                <p className="text-sm text-gray-500">Masukkan data dasar faktur untuk pencatatan dan pelacakan yang
                  akurat.</p>
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
        <div className="flex-1 mt-4">
          <ItemTableImpl />
        </div>
        <div className="flex-1 mt-4">
          <Card>
            <div className="flex flex-row space-x-4">
              <div className="flex-1 flex-col space-y-4">
                <div className="flex-1">
                  <div>
                    <label htmlFor="comment" className="block text-sm/6 font-medium text-gray-900">
                      Keterangan
                    </label>
                    <div className="mt-2">
                    <textarea
                      id="comment"
                      name="comment"
                      rows={4}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-default sm:text-sm/6"
                      defaultValue={""}
                    />
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <div>
                    <label htmlFor="comment" className="block text-sm/6 font-medium text-gray-900">
                      Syarat & Ketentuan
                    </label>
                    <div className="mt-2">
                    <textarea
                      id="comment"
                      name="comment"
                      rows={4}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-primary-default sm:text-sm/6"
                      defaultValue={""}
                    />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="col-span-full">
                  <label htmlFor="cover-photo" className="block text-sm/6 font-medium text-gray-900">
                    Tanda Tangan
                  </label>
                  <div
                    className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                    <div className="text-center">
                      <PhotoIcon aria-hidden="true" className="mx-auto size-12 text-gray-300" />
                      <div className="mt-4 flex text-sm/6 text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md bg-white font-semibold text-primary-default focus-within:ring-2 focus-within:ring-primary-default focus-within:ring-offset-2 focus-within:outline-hidden hover:text-primary-500"
                        >
                          <span>Upload a file</span>
                          <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs/5 text-gray-600">PNG, JPG up to 10MB</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
        <div className="mt-4 flex-1 flex flex-row justify-end gap-x-4">
          <OutlinedButton>
            Simpan Draft
          </OutlinedButton>
          <FilledButton>
            Selanjutnya
          </FilledButton>
        </div>
      </div>
    </>
  );
}
