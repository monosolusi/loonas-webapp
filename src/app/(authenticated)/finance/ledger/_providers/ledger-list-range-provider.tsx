"use client";

import { DateRangeProvider, useDateRange, type DateRange } from "@/core/presentations/providers/date-range-provider";

type LedgerListRangeContextValue = {
  from: string;
  to: string;
  setRange: (next: DateRange) => void;
  isRangeInvalid: boolean;
};

export function useLedgerListRange(): LedgerListRangeContextValue {
  return useDateRange();
}

type LedgerListRangeProviderProps = {
  children: React.ReactNode;
};

export function LedgerListRangeProvider({ children }: LedgerListRangeProviderProps) {
  return (
    <DateRangeProvider localStorageKey="lns_ledger_list_range" maxSpanDays={365}>
      {children}
    </DateRangeProvider>
  );
}
