"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { SearchCombobox, SearchComboboxOption } from "@/core/presentations/components/search-combobox";
import { ProductType } from "@/features/product/domain/enums/product-type";
import { ProductionMode } from "@/features/product/domain/enums/production-mode";
import { useListProducts } from "@/features/product/presentations/hooks/use-list-products";

export type ManufacturedProductVariantOption = {
  id: string;
  name: string;
  isDefault: boolean;
  hasRecipe: boolean;
};

export type ManufacturedProductOption = SearchComboboxOption & {
  productId: string;
  variants: ManufacturedProductVariantOption[];
  recipeComplete: boolean;
  hasAnyRecipe: boolean;
};

type ManufacturedProductComboboxProps = {
  value: ManufacturedProductOption | null;
  onChange: (value: ManufacturedProductOption | null) => void;
};

export function ManufacturedProductCombobox({ value, onChange }: ManufacturedProductComboboxProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { products } = useListProducts({ type: ProductType.MANUFACTURED, limit: 100 });

  const options = useMemo<ManufacturedProductOption[]>(() => {
    if (!products) return [];
    return products
      .filter((p) => p.productionMode === ProductionMode.BATCH)
      .map((p) => {
        const variants: ManufacturedProductVariantOption[] = p.variants.map((v) => ({
          id: v.id,
          name: v.name,
          isDefault: v.isDefault,
          hasRecipe: v.metadata?.hasRecipe !== false,
        }));
        const hasAnyRecipe = variants.some((v) => v.hasRecipe);
        const recipeComplete = p.metadata?.recipeComplete === true;
        const description = !hasAnyRecipe
          ? "⚠ Belum ada resep — klik untuk tambah resep"
          : !recipeComplete
            ? "⚠ Resep belum lengkap untuk semua varian"
            : undefined;
        return {
          id: p.id,
          label: p.name,
          description,
          productId: p.id,
          variants,
          recipeComplete,
          hasAnyRecipe,
        };
      });
  }, [products]);

  const handleChange = (option: ManufacturedProductOption | null) => {
    if (option && !option.hasAnyRecipe) {
      router.push(`/products/${option.productId}`);
      showToast("Tambahkan resep untuk produk ini terlebih dahulu", "warning");
      return;
    }
    onChange(option);
  };

  return (
    <SearchCombobox
      label="Produk"
      options={options}
      value={value}
      onChange={handleChange}
      placeholder="Cari produk..."
      required
    />
  );
}
