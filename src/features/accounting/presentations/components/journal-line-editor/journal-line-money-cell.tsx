"use client";

import clsx from "clsx";
import { CurrencyInput } from "@/core/presentations/components/text-inputs/currency-input";

type JournalLineMoneyCellProps = {
  value: number;
  onChange: (value: number) => void;
  ariaLabel: string;
  disabled?: boolean;
  deEmphasized?: boolean;
};

export function JournalLineMoneyCell({ value, onChange, ariaLabel, disabled, deEmphasized }: JournalLineMoneyCellProps) {
  return (
    <div className={clsx(deEmphasized && "text-neutral-200")}>
      <CurrencyInput
        label=""
        aria-label={ariaLabel}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={false}
      />
    </div>
  );
}
