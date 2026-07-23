"use client";

import { CurrencyInput } from "@/core/presentations/components/text-inputs/currency-input";
import {
  DisplayEntry,
  useFixedCostEntries,
} from "@/app/(authenticated)/accounting/fixed-costs/_providers/fixed-cost-entries-provider";

type FixedCostEntryRowProps = {
  entry: DisplayEntry;
};

export function FixedCostEntryRow({ entry }: FixedCostEntryRowProps) {
  const { setAmount, isClosed } = useFixedCostEntries();

  return (
    <div className="grid grid-cols-[1fr_1fr] items-center gap-3 border-b border-neutral-100 px-6 py-3 last:border-b-0 sm:grid-cols-[3fr_1.5fr] sm:gap-0">
      <span className="text-sm font-medium text-neutral-500">{entry.fixedCostName}</span>
      <CurrencyInput
        label=""
        leftIcon={<span className="text-sm text-neutral-300">Rp</span>}
        placeholder="0"
        value={entry.amount}
        onChange={(val) => setAmount(entry.fixedCostId, val)}
        required={false}
        disabled={isClosed}
        aria-disabled={isClosed}
        aria-describedby={isClosed ? "closed-period-note" : undefined}
      />
    </div>
  );
}
