"use client";

import { useMemo } from "react";
import { SearchCombobox, SearchComboboxOption } from "@/core/presentations/components/search-combobox";
import { ProductType } from "@/features/product/domain/enums/product-type";
import { ProductionMode } from "@/features/product/domain/enums/production-mode";
import { useListProducts } from "@/features/product/presentations/hooks/use-list-products";

export type ManufacturedProductOption = SearchComboboxOption & {
  productId: string;
  variants: { id: string; name: string; isDefault: boolean }[];
};

type ManufacturedProductComboboxProps = {
  value: ManufacturedProductOption | null;
  onChange: (value: ManufacturedProductOption | null) => void;
};

export function ManufacturedProductCombobox({ value, onChange }: ManufacturedProductComboboxProps) {
  const { products } = useListProducts({ type: ProductType.MANUFACTURED, limit: 100 });

  const options = useMemo<ManufacturedProductOption[]>(() => {
    if (!products) return [];
    return products
      .filter((p) => p.productionMode === ProductionMode.BATCH)
      .map((p) => ({
        id: p.id,
        label: p.name,
        productId: p.id,
        variants: p.variants.map((v) => ({ id: v.id, name: v.name, isDefault: v.isDefault })),
      }));
  }, [products]);

  return (
    <SearchCombobox
      label="Produk"
      options={options}
      value={value}
      onChange={onChange}
      placeholder="Cari produk..."
      required
    />
  );
}
