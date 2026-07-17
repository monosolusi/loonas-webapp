"use client";

import clsx from "clsx";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";

type BalanceAccountInputRowProps = {
  account: LedgerAccountEntity;
  value: number;
  onChange: (accountId: string, amount: number) => void;
};

export function BalanceAccountInputRow({ account, value, onChange }: BalanceAccountInputRowProps) {
  const inputId = `balance-input-${account.id}`;
  const displayValue = value > 0 ? IDRFormatter.toThousand(value) : "";

  function handleChange(raw: string) {
    // Allow only digits and dots (thousands separator)
    const sanitized = raw.replace(/[^0-9.]/g, "");
    const parsed = IDRFormatter.toNumber(sanitized);
    onChange(account.id, parsed);
  }

  function handleBlur() {
    // Reformat on blur
    if (value > 0) {
      // value is already an integer — display is re-derived from value on next render
    }
  }

  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3 px-4 py-2">
      <label
        htmlFor={inputId}
        className="min-w-0 flex-1 cursor-pointer"
      >
        <span className="block text-sm text-neutral-400 truncate">{account.name}</span>
        <span className="block text-xs text-neutral-300">{account.code}</span>
      </label>

      <div className="flex items-center gap-1 sm:shrink-0">
        <span className="text-sm text-neutral-300">Rp</span>
        <input
          id={inputId}
          type="text"
          inputMode="numeric"
          value={displayValue}
          placeholder="0"
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={clsx(
            "h-11 w-full rounded-lg border border-neutral-100 px-3 text-right text-sm text-neutral-400",
            "outline-none transition-all focus:border-primary-300 focus:ring-2 focus:ring-primary-300/20",
            "sm:w-44",
          )}
        />
      </div>
    </div>
  );
}
