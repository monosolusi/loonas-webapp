"use client";

import { DateRangeProvider, useDateRange, type DateRange } from "@/core/presentations/providers/date-range-provider";

type JournalRangeContextValue = {
  from: string;
  to: string;
  setRange: (next: DateRange) => void;
  isRangeInvalid: boolean;
};

export function useJournalRange(): JournalRangeContextValue {
  return useDateRange();
}

type JournalRangeProviderProps = {
  children: React.ReactNode;
};

export function JournalRangeProvider({ children }: JournalRangeProviderProps) {
  return (
    <DateRangeProvider localStorageKey="lns_journals_range" maxSpanDays={365}>
      {children}
    </DateRangeProvider>
  );
}