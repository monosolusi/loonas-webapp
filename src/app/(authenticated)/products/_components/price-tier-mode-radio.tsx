"use client";

import clsx from "clsx";
import { CheckIcon } from "@heroicons/react/20/solid";
import {
  TierMode,
  TierModeDescription,
  TierModeLabel,
  TierModeType,
} from "@/features/product/domain/enums/tier-mode";

const OPTIONS: TierModeType[] = [TierMode.VOLUME, TierMode.GRADUATED];

type PriceTierModeRadioProps = {
  value: TierModeType;
  onChange: (value: TierModeType) => void;
  disabled?: boolean;
};

export function PriceTierModeRadio({ value, onChange, disabled }: PriceTierModeRadioProps) {
  return (
    <fieldset>
      <legend className="mb-1.5 text-sm font-medium text-neutral-500">Cara Hitung</legend>
      <div className="flex flex-col gap-y-2">
        {OPTIONS.map((option) => {
          const isSelected = value === option;
          return (
            <label
              key={option}
              className={clsx(
                "flex items-start justify-between gap-3 rounded-lg border p-3 transition-colors",
                "has-[:focus-visible]:ring-primary-300 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-offset-1",
                disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                isSelected ? "border-primary-300 bg-primary-50" : "border-neutral-100 hover:border-neutral-200",
              )}
            >
              <input
                type="radio"
                name="price-tier-mode"
                value={option}
                checked={isSelected}
                disabled={disabled}
                onChange={() => onChange(option)}
                className="sr-only"
              />
              <div className="flex min-w-0 flex-col gap-1">
                <span className={clsx("text-sm font-medium", isSelected ? "text-primary-500" : "text-neutral-500")}>
                  {TierModeLabel[option]}
                </span>
                <span className="text-xs leading-relaxed text-neutral-300">{TierModeDescription[option]}</span>
              </div>
              {isSelected && <CheckIcon className="text-primary-300 size-5 shrink-0" />}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
