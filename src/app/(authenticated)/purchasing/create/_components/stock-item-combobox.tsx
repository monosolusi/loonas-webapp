"use client";

import { useMemo } from "react";
import { SearchCombobox, SearchComboboxOption } from "@/core/presentations/components/search-combobox";
import { StockItemTypeLabel, StockItemTypeType } from "@/features/inventory/domain/enums/stock-item-type";
import { useListStockItems } from "@/features/inventory/presentations/hooks/use-list-stock-items";

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
  const stockResult = useListStockItems({ limit: 100 });

  const options = useMemo<StockItemOption[]>(() => {
    if (!stockResult.stockItems) return [];
    return stockResult.stockItems
      .filter((item) => !excludeIds.includes(item.id))
      .map((item) => ({
        id: item.id,
        label: item.itemName,
        description: StockItemTypeLabel[item.type as StockItemTypeType] ?? item.type,
        rawMaterialId: item.rawMaterial?.id ?? null,
        variantId: item.variant?.id ?? null,
        unit: item.rawMaterial?.unit ?? null,
      }));
  }, [stockResult.stockItems, excludeIds]);

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
