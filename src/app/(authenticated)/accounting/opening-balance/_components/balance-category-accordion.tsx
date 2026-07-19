"use client";

import { useState, useId, useMemo } from "react";
import clsx from "clsx";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { BalanceGroupAccount, PlainAmountMap } from "@/app/(authenticated)/accounting/opening-balance/_providers/opening-balance-wizard-provider";
import { BalanceAccountInputRow } from "@/app/(authenticated)/accounting/opening-balance/_components/balance-account-input-row";

type BalanceCategoryAccordionProps = {
  groupLabel: string;
  groupSubtitle: string;
  accounts: BalanceGroupAccount[];
  amountMap: PlainAmountMap;
  onAmountChange: (accountId: string, amount: number) => void;
};

export function BalanceCategoryAccordion({
  groupLabel,
  groupSubtitle,
  accounts,
  amountMap,
  onAmountChange,
}: BalanceCategoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const panelId = useId();
  const triggerId = useId();

  // Compute running subtotal for this group (leaf accounts only)
  const subtotal = useMemo(() => {
    let total = 0;
    for (const { account, isHeader } of accounts) {
      if (!isHeader) {
        total += amountMap.get(account.id) ?? 0;
      }
    }
    return total;
  }, [accounts, amountMap]);

  return (
    <div className="rounded-lg border border-neutral-100">
      <button
        id={triggerId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        onClick={() => setIsOpen((prev) => !prev)}
        className={clsx(
          "flex h-11 w-full items-center gap-3 rounded-lg px-4 text-left transition-colors",
          "hover:bg-primary-300/5 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:ring-offset-2",
        )}
      >
        <ChevronRightIcon
          className={clsx(
            "size-4 shrink-0 text-neutral-300 transition-transform duration-150 ease-out",
            isOpen && "rotate-90",
          )}
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-sm font-semibold text-neutral-400">{groupLabel}</span>
          <span className="text-xs text-neutral-300">{groupSubtitle}</span>
        </div>
        <span className="shrink-0 text-sm font-semibold text-neutral-400">
          Rp {IDRFormatter.toThousand(subtotal)}
        </span>
      </button>

      {isOpen && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className="border-t border-neutral-100 py-2"
        >
          {accounts.length === 0 && (
            <p className="px-4 py-3 text-sm text-neutral-300">Tidak ada akun tersedia.</p>
          )}
          {accounts.map(({ account, isHeader }) =>
            isHeader ? (
              <div
                key={account.id}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-300"
                aria-hidden="true"
              >
                {account.name}
              </div>
            ) : (
              <BalanceAccountInputRow
                key={account.id}
                account={account}
                value={amountMap.get(account.id) ?? 0}
                onChange={onAmountChange}
              />
            ),
          )}
        </div>
      )}
    </div>
  );
}
