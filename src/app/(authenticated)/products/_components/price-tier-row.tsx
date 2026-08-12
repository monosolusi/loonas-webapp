"use client";

import clsx from "clsx";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { CurrencyInput } from "@/core/presentations/components/text-inputs/currency-input";
import {
  PriceTierFormRow,
  PriceTierRowError,
} from "@/features/product/presentations/types/price-tier-form.types";

type PriceTierRowProps = {
  row: PriceTierFormRow;
  error: PriceTierRowError | undefined;
  onChange: (updates: Partial<PriceTierFormRow>) => void;
  onRemove: () => void;
  disabled?: boolean;
};

export function PriceTierRow({ row, error, onChange, onRemove, disabled }: PriceTierRowProps) {
  return (
    <div className="grid grid-cols-[1fr_1fr_32px] items-start gap-x-3">
      {/*
        A plain TextInput, not NumberInput: the shared numeric input parses id-ID grouping
        and would turn a typed "1.5" into 15. The threshold is parsed by parseMinQty.
      */}
      <TextInput
        label=""
        inputMode="decimal"
        placeholder="Contoh 1,5"
        value={row.minQty}
        onChange={(value) => onChange({ minQty: value })}
        error={error?.minQty ?? null}
        disabled={disabled}
        required={false}
      />
      <CurrencyInput
        label=""
        leftIcon={null}
        leftAddOn="Rp"
        placeholder="0"
        value={row.unitPrice}
        onChange={(value) => onChange({ unitPrice: value })}
        error={error?.unitPrice ?? null}
        disabled={disabled}
        required={false}
      />
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label="Hapus tingkat"
        className={clsx(
          "mt-1.5 flex size-8 shrink-0 items-center justify-center self-start rounded-lg text-neutral-200 transition-colors",
          disabled
            ? "cursor-not-allowed opacity-30"
            : "hover:bg-error-50 hover:text-error-300 cursor-pointer",
        )}
      >
        <XMarkIcon className="size-4" />
      </button>
    </div>
  );
}
