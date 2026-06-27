"use client";

import { DateRangeProvider, useDateRange, type DateRange } from "@/core/presentations/providers/date-range-provider";

type LedgerDetailRangeContextValue = {
  from: string;
  to: string;
  setRange: (next: DateRange) => void;
  isRangeInvalid: boolean;
};

export function useLedgerDetailRange(): LedgerDetailRangeContextValue {
  return useDateRange();
}

type LedgerDetailRangeProviderProps = {
  children: React.ReactNode;
};

export function LedgerDetailRangeProvider({ children }: LedgerDetailRangeProviderProps) {
  return (
    <DateRangeProvider localStorageKey="lns_ledger_detail_range" maxSpanDays={365}>
      {children}
    </DateRangeProvider>
  );
}
