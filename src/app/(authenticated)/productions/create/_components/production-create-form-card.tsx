"use client";

import { useMemo } from "react";
import Link from "next/link";
import { SectionCard } from "@/core/presentations/components/section-card";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { NumberInput } from "@/core/presentations/components/text-inputs/number-input";
import { DatePickerInput } from "@/core/presentations/components/text-inputs/date-picker-input";
import {
  SearchCombobox,
  SearchComboboxOption,
} from "@/core/presentations/components/search-combobox";
import { useProductionCreate } from "@/app/(authenticated)/productions/create/_providers/production-create-provider";
import {
  ManufacturedProductCombobox,
  ManufacturedProductOption,
  ManufacturedProductVariantOption,
} from "@/app/(authenticated)/productions/create/_components/manufactured-product-combobox";

type VariantOption = SearchComboboxOption;

function buildVariantOption(variant: ManufacturedProductVariantOption): VariantOption {
  return {
    id: variant.id,
    label: variant.name,
  };
}

export function ProductionCreateFormCard() {
  const { product, variantId, quantity, date, note, setProduct, setVariantId, setQuantity, setDate, setNote } =
    useProductionCreate();

  const handleProductChange = (value: ManufacturedProductOption | null) => {
    setProduct(value);
    if (!value) {
      setVariantId(null);
      return;
    }
    const producibleVariants = value.variants.filter((v) => v.hasRecipe);
    if (producibleVariants.length === 1) {
      setVariantId(producibleVariants[0].id);
    } else {
      setVariantId(null);
    }
  };

  const producibleVariants = useMemo(() => {
    if (!product) return [];
    return product.variants.filter((v) => v.hasRecipe);
  }, [product]);

  const variantOptions = useMemo(() => {
    return producibleVariants.map(buildVariantOption);
  }, [producibleVariants]);

  const selectedVariant = useMemo(() => {
    if (!variantId) return null;
    return variantOptions.find((v) => v.id === variantId) ?? null;
  }, [variantOptions, variantId]);

  const hiddenVariantCount = product ? product.variants.length - producibleVariants.length : 0;
  const hasProducibleVariants = producibleVariants.length > 0;
  const variantComboboxEmptyMessage = hasProducibleVariants ? undefined : "Belum ada varian";

  const handleVariantChange = (value: VariantOption | null) => {
    setVariantId(value ? value.id : null);
  };

  return (
    <SectionCard title="Detail Produksi" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-2 gap-x-4">
          <ManufacturedProductCombobox value={product} onChange={handleProductChange} />
          <DatePickerInput label="Tanggal Produksi" value={date} onChange={setDate} required />
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          <div className="flex flex-col gap-y-1">
            <SearchCombobox<VariantOption>
              label="Varian"
              options={variantOptions}
              value={selectedVariant}
              onChange={handleVariantChange}
              placeholder={product ? "Pilih varian" : "Pilih produk terlebih dahulu"}
              emptyMessage={variantComboboxEmptyMessage}
              disabled={!product}
              required
            />
            {hiddenVariantCount > 0 && product && (
              <span className="text-xs text-warning-400">
                {hiddenVariantCount} varian disembunyikan karena belum punya resep.{" "}
                <Link
                  href={`/products/${product.productId}`}
                  className="text-primary-300 underline hover:no-underline"
                >
                  Tambah resep ↗
                </Link>
              </span>
            )}
          </div>
          <NumberInput
            label="Jumlah Produksi"
            value={quantity}
            onChange={setQuantity}
            allowDecimal={false}
            placeholder="Contoh: 100"
            required
          />
        </div>
        <TextInput label="Catatan" placeholder="Opsional" value={note} onChange={setNote} />
      </div>
    </SectionCard>
  );
}
