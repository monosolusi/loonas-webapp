"use client";

import { XMarkIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { SelectInput } from "@/core/presentations/components/select-input";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { CoaMappingLinePosition } from "@/features/accounting/domain/entities/coa-mapping-line";
import { LedgerAccountCombobox } from "@/features/accounting/presentations/components/ledger-account-combobox";
import { CoaMappingLineFormItem } from "@/app/(authenticated)/settings/chart-of-accounts/mappings/_components/coa-mapping-form.types";

const POSITION_OPTIONS = [
  { label: "Debit", value: "debit" },
  { label: "Credit", value: "credit" },
];

type CoaMappingLineRowProps = {
  line: CoaMappingLineFormItem;
  onChange: (updates: Partial<CoaMappingLineFormItem>) => void;
  onRemove: () => void;
  canRemove: boolean;
  disabled?: boolean;
};

export function CoaMappingLineRow({ line, onChange, onRemove, canRemove, disabled }: CoaMappingLineRowProps) {
  return (
    <div className="grid grid-cols-[2fr_1fr_1.5fr_40px] items-end gap-x-3">
      <LedgerAccountCombobox
        noLabel
        value={line.account}
        onChange={(account: LedgerAccountEntity | null) => onChange({ account })}
        placeholder="Pilih akun"
        disabled={disabled}
        required
      />
      <SelectInput
        noLabel
        value={line.position}
        options={POSITION_OPTIONS}
        onChange={(value) => onChange({ position: value as CoaMappingLinePosition })}
        disabled={disabled}
      />
      <TextInput
        label=""
        placeholder="Label (opsional)"
        value={line.label}
        onChange={(value) => onChange({ label: value })}
        disabled={disabled}
        maxLength={64}
      />
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove || disabled}
        aria-label="Hapus baris"
        className={clsx(
          "flex size-8 items-center justify-center rounded-lg text-neutral-200 transition-colors",
          !canRemove || disabled
            ? "cursor-not-allowed opacity-30"
            : "hover:bg-error-50 hover:text-error-300 cursor-pointer",
        )}
      >
        <XMarkIcon className="size-4" />
      </button>
    </div>
  );
}
