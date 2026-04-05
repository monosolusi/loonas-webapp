"use client";

import { useMemo } from "react";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { PurchaseFormItem, usePurchaseCreate } from "@/app/(authenticated)/purchasing/create/_providers/purchase-create-provider";
import { StockItemCombobox, StockItemOption } from "@/app/(authenticated)/purchasing/create/_components/stock-item-combobox";

type PurchaseItemRowProps = {
  item: PurchaseFormItem;
  excludeIds: string[];
};

export function PurchaseItemRow({ item, excludeIds }: PurchaseItemRowProps) {
  const { updateItem, removeItem } = usePurchaseCreate();

  const comboboxValue = useMemo<StockItemOption | null>(() => {
    if (!item.rawMaterialId && !item.variantId) return null;
    return {
      id: item.rawMaterialId ?? item.variantId ?? "",
      label: item.label,
      rawMaterialId: item.rawMaterialId,
      variantId: item.variantId,
      unit: item.unit,
    };
  }, [item.rawMaterialId, item.variantId, item.label, item.unit]);

  const handleItemChange = (option: StockItemOption | null) => {
    updateItem(item.key, {
      rawMaterialId: option?.rawMaterialId ?? null,
      variantId: option?.variantId ?? null,
      label: option?.label ?? "",
      unit: option?.unit ?? null,
    });
  };

  const qty = Number(item.quantity) || 0;
  const price = Number(item.unitPrice) || 0;
  const total = qty * price;

  return (
    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] items-center gap-x-3 border-b border-neutral-100 px-4 py-3 last:border-b-0">
      <StockItemCombobox value={comboboxValue} onChange={handleItemChange} excludeIds={excludeIds} />
      <TextInput
        label=""
        type="number"
        placeholder="Qty"
        value={item.quantity}
        onChange={(v) => updateItem(item.key, { quantity: v })}
        rightAddOn={item.unit ?? undefined}
      />
      <TextInput
        label=""
        type="number"
        placeholder="Harga"
        value={item.unitPrice}
        onChange={(v) => updateItem(item.key, { unitPrice: v })}
        leftAddOn="Rp"
        rightAddOn={item.unit ? `/${item.unit}` : undefined}
      />
      <span className="text-right text-sm font-medium text-neutral-500">
        {total > 0 ? <>Rp <NumberDisplay value={total} /></> : "—"}
      </span>
      <button
        type="button"
        onClick={() => removeItem(item.key)}
        className="flex size-8 items-center justify-center rounded-lg text-neutral-200 transition-colors hover:bg-red-50 hover:text-red-500"
      >
        <XMarkIcon className="size-4" />
      </button>
    </div>
  );
}
