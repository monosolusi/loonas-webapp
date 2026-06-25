"use client";

import clsx from "clsx";
import { FixedCostCategory } from "@/features/fixed-cost/domain/enums/fixed-cost-category";

type Option = {
  value: FixedCostCategory;
  label: string;
  description: string;
};

const OPTIONS: Option[] = [
  {
    value: "production",
    label: "Produksi",
    description: "Biaya overhead pabrik. Masuk ke pool alokasi biaya manajerial produk.",
  },
  {
    value: "general",
    label: "Umum & Administrasi",
    description: "Biaya operasional non-produksi. Tidak dialokasikan ke produk.",
  },
];

type FixedCostCategoryRadioProps = {
  value: FixedCostCategory;
  onChange: (value: FixedCostCategory) => void;
};

export function FixedCostCategoryRadio({ value, onChange }: FixedCostCategoryRadioProps) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-neutral-500">
        Kategori Biaya
      </legend>
      <div className="flex flex-col gap-y-2">
        {OPTIONS.map((option) => {
          const isSelected = value === option.value;
          return (
            <label
              key={option.value}
              className={clsx(
                "flex h-11 cursor-pointer items-center gap-x-3 rounded-lg border px-3 transition-colors",
                isSelected
                  ? "border-primary-300 bg-primary-50"
                  : "border-neutral-100 hover:border-neutral-200",
              )}
            >
              <input
                type="radio"
                name="fixed-cost-category"
                value={option.value}
                checked={isSelected}
                onChange={() => onChange(option.value)}
                className="size-4 shrink-0 accent-primary-300 focus:ring-2 focus:ring-primary-300 focus:ring-offset-1"
              />
              <div className="min-w-0 flex-1">
                <span
                  className={clsx(
                    "text-sm font-medium",
                    isSelected ? "text-primary-500" : "text-neutral-500",
                  )}
                >
                  {option.label}
                </span>
                <span className="ml-2 text-xs text-neutral-300">{option.description}</span>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
