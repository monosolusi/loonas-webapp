"use client";

import { useMemo } from "react";
import { SectionCard } from "@/core/presentations/components/section-card";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { DatePickerInput } from "@/core/presentations/components/text-inputs/date-picker-input";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { usePurchaseCreate } from "@/app/(authenticated)/purchasing/create/_providers/purchase-create-provider";
import { PurchaseItemRow } from "@/app/(authenticated)/purchasing/create/_components/purchase-item-row";

export function PurchaseCreateFormCard() {
  const { date, note, items, setDate, setNote, addItem } = usePurchaseCreate();

  const excludeIds = useMemo(
    () => items.filter((i) => i.rawMaterialId || i.variantId).map((i) => i.rawMaterialId ?? i.variantId ?? ""),
    [items],
  );

  const grandTotal = useMemo(
    () => items.reduce((sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0), 0),
    [items],
  );

  return (
    <SectionCard title="Detail Pembelian" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
      <div className="flex flex-col gap-y-6">
        <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
          <DatePickerInput label="Tanggal" value={date} onChange={setDate} required />
          <TextInput label="Catatan" placeholder="Opsional" value={note} onChange={setNote} />
        </div>

        <div className="flex flex-col gap-y-2">
          <span className="text-sm font-medium text-neutral-500">Item Pembelian</span>
          <div className="-mx-6 -mb-6">
            {/* Wide item matrix: keep desktop column widths, scroll horizontally on narrow screens. */}
            <div className="overflow-x-auto">
              <div className="min-w-[640px]">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] gap-x-3 border-b border-neutral-100 bg-neutral-50 px-4 py-2">
                  <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Item</span>
                  <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Jumlah</span>
                  <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Harga Satuan</span>
                  <span className="text-right text-xs font-medium tracking-wider text-neutral-300 uppercase">Total</span>
                  <span />
                </div>
                {items.map((item) => (
                  <PurchaseItemRow key={item.key} item={item} excludeIds={excludeIds} />
                ))}
              </div>
            </div>
            <div className="flex flex-row items-center justify-between border-t border-neutral-100 px-4 py-3">
              <div className="flex">
                <SecondaryButton outlined label="+ Tambah Item" onClick={addItem} />
              </div>
              <div className="flex flex-row items-center gap-x-2">
                <span className="text-sm text-neutral-300">Total</span>
                <span className="text-sm font-semibold text-neutral-500">
                  Rp {grandTotal > 0 ? <NumberDisplay value={grandTotal} /> : "0"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}
