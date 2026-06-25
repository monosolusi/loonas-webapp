"use client";

import { useMemo } from "react";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { BalanceGroupAccount } from "@/app/(authenticated)/finance/opening-balance/_providers/opening-balance-wizard-provider";

type ReviewGroupSummaryProps = {
  groupLabel: string;
  accounts: BalanceGroupAccount[];
  amountMap: Map<string, number>;
};

export function ReviewGroupSummary({ groupLabel, accounts, amountMap }: ReviewGroupSummaryProps) {
  const nonZeroAccounts = useMemo(
    () => accounts.filter(({ account, isHeader }) => !isHeader && (amountMap.get(account.id) ?? 0) > 0),
    [accounts, amountMap],
  );

  const subtotal = useMemo(
    () => nonZeroAccounts.reduce((sum, { account }) => sum + (amountMap.get(account.id) ?? 0), 0),
    [nonZeroAccounts, amountMap],
  );

  if (nonZeroAccounts.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-neutral-300">{groupLabel}</p>
      <div className="mt-2 flex flex-col gap-1">
        {nonZeroAccounts.map(({ account }) => (
          <div key={account.id} className="flex justify-between">
            <span className="text-sm text-neutral-400">{account.name}</span>
            <span className="text-sm font-medium text-neutral-400">
              Rp {IDRFormatter.toThousand(amountMap.get(account.id) ?? 0)}
            </span>
          </div>
        ))}
      </div>
      <div className="mt-1 border-t border-neutral-100 pt-2">
        <div className="flex justify-between">
          <span className="text-sm font-semibold text-neutral-400">Subtotal</span>
          <span className="text-sm font-semibold text-neutral-400">
            Rp {IDRFormatter.toThousand(subtotal)}
          </span>
        </div>
      </div>
    </div>
  );
}
