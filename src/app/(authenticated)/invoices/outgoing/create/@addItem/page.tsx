"use client";

import { useEffect } from "react";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";
import { NameInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/name-input";
import { DescriptionInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/description-input";
import { QtyInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/qty-input";
import { PriceInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/price-input";
import { TotalField } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/total-field";
import { DiscountTypeSelect } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/discount-type";
import { DiscountInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/discount-input";
import { TaxTypeSelect } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/tax-type";
import { TaxInput } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/tax-input";
import { TaxBaseField } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/tax-base-field";
import { TotalWithTaxField } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/total-with-tax-field";
import { CalculateTaxButton } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/calculate-tax-button";

export default function AddItemSection() {
  const { currentStep, editingItemIndex, items } = useCreateOutgoingInvoice();
  const { clearInput, setInput } = useAddItem();

  const isAddMode = currentStep === "invoice-details.add-item";
  const isEditMode = currentStep === "invoice-details.edit-item";

  useEffect(() => {
    if (isAddMode) {
      clearInput?.();
    } else if (isEditMode && editingItemIndex !== null) {
      const item = items[editingItemIndex];
      if (item) setInput?.(item);
    }
  }, [currentStep]);

  if (!isAddMode && !isEditMode) return null;

  return (
    <div className="flex flex-col gap-y-8">
      {/* Page header */}
      <div className="flex flex-col">
        <h1 className="text-base font-semibold text-gray-900">
          {isEditMode ? "Ubah Detail Item" : "Tambah Item Baru"}
        </h1>
        <p className="text-sm text-gray-500">Yuk, isi detail barang yang mau kamu cantumkan di faktur.</p>
      </div>

      {/* Section 1: Informasi Item */}
      <section className="flex flex-col gap-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Informasi Item</h2>
          <p className="text-xs text-gray-400">Detail dasar item yang akan dicantumkan di faktur.</p>
        </div>
        <NameInput />
        <DescriptionInput />
      </section>

      <hr className="border-neutral-100" />

      {/* Section 2: Harga & Kuantitas */}
      <section className="flex flex-col gap-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Harga & Kuantitas</h2>
          <p className="text-xs text-gray-400">Tentukan jumlah dan harga satuan item.</p>
        </div>
        <div className="grid grid-cols-4 gap-3">
          <QtyInput />
          <PriceInput />
          <div className="col-span-2">
            <TotalField />
          </div>
        </div>
      </section>

      <hr className="border-neutral-100" />

      {/* Section 3: Diskon */}
      <section className="flex flex-col gap-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Diskon</h2>
          <p className="text-xs text-gray-400">Opsional. Pilih jenis dan nilai diskon untuk item ini.</p>
        </div>
        <div className="flex flex-row space-x-3">
          <div className="flex-1">
            <DiscountTypeSelect />
          </div>
          <div className="flex-1">
            <DiscountInput />
          </div>
        </div>
      </section>

      <hr className="border-neutral-100" />

      {/* Section 4: Perpajakan */}
      <section className="flex flex-col gap-y-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Perpajakan</h2>
          <p className="text-xs text-gray-400">
            Pilih jenis pajak. Jika kena pajak, isi nilai pajak dan DPP lalu klik Hitung Pajak.
          </p>
        </div>
        <TaxTypeSelect />
        <div className="flex flex-row space-x-3">
          <div className="flex-1">
            <TaxInput />
          </div>
          <div className="flex-1">
            <TaxBaseField />
          </div>
        </div>
        <div className="flex flex-row items-end space-x-3">
          <div className="flex-1">
            <TotalWithTaxField />
          </div>
          <div className="shrink-0">
            <CalculateTaxButton />
          </div>
        </div>
      </section>
    </div>
  );
}
