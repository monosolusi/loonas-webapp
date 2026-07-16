"use client";

import clsx from "clsx";
import { CheckIcon } from "@heroicons/react/20/solid";
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
                "flex cursor-pointer items-start justify-between gap-3 rounded-lg border p-3 transition-colors",
                "has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-300 has-[:focus-visible]:ring-offset-1",
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
                className="sr-only"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <span
                  className={clsx(
                    "text-sm font-medium",
                    isSelected ? "text-primary-500" : "text-neutral-500",
                  )}
                >
                  {option.label}
                </span>
                <span className="text-xs leading-relaxed text-neutral-300">{option.description}</span>
              </div>
              {isSelected && <CheckIcon className="size-5 shrink-0 text-primary-300" />}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
