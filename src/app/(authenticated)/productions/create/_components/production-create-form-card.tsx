"use client";

import { useMemo } from "react";
import { SectionCard } from "@/core/presentations/components/section-card";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { NumberInput } from "@/core/presentations/components/text-inputs/number-input";
import { DatePickerInput } from "@/core/presentations/components/text-inputs/date-picker-input";
import { SelectInput } from "@/core/presentations/components/select-input";
import { useProductionCreate } from "@/app/(authenticated)/productions/create/_providers/production-create-provider";
import {
  ManufacturedProductCombobox,
  ManufacturedProductOption,
} from "@/app/(authenticated)/productions/create/_components/manufactured-product-combobox";

export function ProductionCreateFormCard() {
  const { product, variantId, quantity, date, note, setProduct, setVariantId, setQuantity, setDate, setNote } =
    useProductionCreate();

  const handleProductChange = (value: ManufacturedProductOption | null) => {
    setProduct(value);
    if (value && value.variants.length === 1) {
      setVariantId(value.variants[0].id);
    } else {
      setVariantId(null);
    }
  };

  const variantOptions = useMemo(() => {
    if (!product) return [];
    return product.variants.map((v) => ({ label: v.name, value: v.id }));
  }, [product]);

  const showVariantSelect = product && product.variants.length > 1;

  return (
    <SectionCard title="Detail Produksi" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
      <div className="flex flex-col gap-y-4">
        <div className="grid grid-cols-2 gap-x-4">
          <ManufacturedProductCombobox value={product} onChange={handleProductChange} />
          <DatePickerInput label="Tanggal Produksi" value={date} onChange={setDate} required />
        </div>
        <div className="grid grid-cols-2 gap-x-4">
          {showVariantSelect && (
            <SelectInput
              label="Varian"
              value={variantId ?? ""}
              options={variantOptions}
              onChange={setVariantId}
              placeholder="Pilih varian"
              required
            />
          )}
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
