"use client";

import { DateRangeProvider, useDateRange, type DateRange } from "@/core/presentations/providers/date-range-provider";

type PosSalesRangeContextValue = {
  from: string;
  to: string;
  setRange: (next: DateRange) => void;
  isRangeInvalid: boolean;
};

export function usePosSalesRange(): PosSalesRangeContextValue {
  return useDateRange();
}

type PosSalesRangeProviderProps = {
  children: React.ReactNode;
};

export function PosSalesRangeProvider({ children }: PosSalesRangeProviderProps) {
  return (
    <DateRangeProvider maxSpanDays={365}>
      {children}
    </DateRangeProvider>
  );
}