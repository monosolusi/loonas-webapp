"use client";

import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

export function WizardHeader() {
  const { isEditMode } = useCreateOutgoingInvoice();

  return (
    <div className="flex flex-col">
      <div className="text-2xl leading-8 font-bold tracking-tighter">
        {isEditMode ? "Edit Faktur Keluaran" : "Buat Faktur Keluaran"}
      </div>
      <div className="text-base leading-6 font-normal text-neutral-300">
        {isEditMode
          ? "Perbarui data draf faktur keluaran, lalu simpan perubahannya."
          : "Kirim faktur ke Client kamu disini. Ikuti langkah-langkah dibawah ini untuk membuat faktur keluaran baru"}
      </div>
    </div>
  );
}
