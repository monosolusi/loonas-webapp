"use client";

import Image from "next/image";
import clsx from "clsx";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { CurrencyInput } from "@/core/presentations/components/text-inputs/currency-input";

export type VariantFormRow = {
  key: string;
  name: string;
  sku: string;
  price: number;
};

type VariantTableProps = {
  variants: VariantFormRow[];
  onChange: (variants: VariantFormRow[]) => void;
};

export function VariantTable({ variants, onChange }: VariantTableProps) {
  const showRemove = variants.length > 1;

  const updateField = (index: number, field: "name" | "sku", value: string) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const updatePrice = (index: number, value: number) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], price: value };
    onChange(updated);
  };

  const removeRow = (index: number) => {
    if (variants.length <= 1) return;
    onChange(variants.filter((_, i) => i !== index));
  };

  const addRow = () => {
    onChange([...variants, { key: crypto.randomUUID(), name: "", sku: "", price: 0 }]);
  };

  return (
    <div className="flex flex-col gap-y-3">
      {/* Wide pricing matrix: keep desktop column widths, scroll horizontally on narrow screens. */}
      <div className="-mx-1 overflow-x-auto px-1">
        <div className="flex min-w-[560px] flex-col gap-y-3">
          <div className={clsx("grid gap-x-3 px-1", showRemove ? "grid-cols-[1fr_1fr_1fr_36px]" : "grid-cols-3")}>
            <span className="text-xs font-medium text-neutral-300">Nama Varian *</span>
            <span className="text-xs font-medium text-neutral-300">SKU</span>
            <span className="text-xs font-medium text-neutral-300">Harga *</span>
            {showRemove && <span />}
          </div>
          {variants.map((row, index) => (
            <div key={row.key} className={clsx("grid gap-x-3", showRemove ? "grid-cols-[1fr_1fr_1fr_36px]" : "grid-cols-3")}>
              <TextInput
                label=""
                placeholder="Nama varian"
                value={row.name}
                onChange={(value) => updateField(index, "name", value)}
              />
              <TextInput
                label=""
                placeholder="SKU varian"
                value={row.sku}
                onChange={(value) => updateField(index, "sku", value)}
              />
              <CurrencyInput
                label=""
                placeholder="0"
                value={row.price}
                onChange={(value) => updatePrice(index, value)}
                leftIcon={null}
                leftAddOn="Rp"
                required={false}
              />
              {showRemove && (
                <button
                  type="button"
                  onClick={() => removeRow(index)}
                  className="flex size-9 items-center justify-center self-center rounded-lg text-neutral-200 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Image src="/assets/images/trash-icon-neutral-400-w16-h16.svg" alt="remove" width={16} height={16} />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={addRow}
        className="self-start rounded-lg border border-dashed border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:border-primary-300/30 hover:bg-primary-300/5 hover:text-primary-300"
      >
        + Tambah Varian
      </button>
    </div>
  );
}
