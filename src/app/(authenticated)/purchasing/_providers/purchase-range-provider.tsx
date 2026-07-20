"use client";

import { DateRangeProvider, useDateRange, type DateRange } from "@/core/presentations/providers/date-range-provider";

type PurchaseRangeContextValue = {
  from: string;
  to: string;
  setRange: (next: DateRange) => void;
  isRangeInvalid: boolean;
};

export function usePurchaseRange(): PurchaseRangeContextValue {
  return useDateRange();
}

type PurchaseRangeProviderProps = {
  children: React.ReactNode;
};

export function PurchaseRangeProvider({ children }: PurchaseRangeProviderProps) {
  return (
    <DateRangeProvider maxSpanDays={365}>
      {children}
    </DateRangeProvider>
  );
}
