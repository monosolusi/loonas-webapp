"use client";

import { useMemo } from "react";
import { SearchCombobox, SearchComboboxOption } from "@/core/presentations/components/search-combobox";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";
import { useListPurchasableItems } from "@/features/purchasing/presentations/hooks/use-list-purchasable-items";

export type StockItemOption = SearchComboboxOption & {
  rawMaterialId: string | null;
  variantId: string | null;
  unit: string | null;
};

type StockItemComboboxProps = {
  value: StockItemOption | null;
  onChange: (value: StockItemOption | null) => void;
  excludeIds?: string[];
};

export function StockItemCombobox({ value, onChange, excludeIds = [] }: StockItemComboboxProps) {
  const result = useListPurchasableItems({ limit: 100 });

  const options = useMemo<StockItemOption[]>(() => {
    if (!result.items) return [];
    return result.items
      .filter((item) => !excludeIds.includes(item.id))
      .map((item) => {
        const isFinishedGoods = item.type === StockItemType.FINISHED_GOODS;

        return {
          id: item.id,
          label: item.itemName,
          description: isFinishedGoods && item.variantName ? item.variantName : undefined,
          rawMaterialId: item.rawMaterial?.id ?? null,
          variantId: item.variant?.id ?? null,
          unit: item.rawMaterial?.unit ?? null,
        };
      });
  }, [result.items, excludeIds]);

  return (
    <SearchCombobox
      noLabel
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Cari item..."
    />
  );
}
