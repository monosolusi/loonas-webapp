"use client";

import { DateRangeProvider, useDateRange, type DateRange } from "@/core/presentations/providers/date-range-provider";

type ProductionRangeContextValue = {
  from: string;
  to: string;
  setRange: (next: DateRange) => void;
  isRangeInvalid: boolean;
};

export function useProductionRange(): ProductionRangeContextValue {
  return useDateRange();
}

type ProductionRangeProviderProps = {
  children: React.ReactNode;
};

export function ProductionRangeProvider({ children }: ProductionRangeProviderProps) {
  return (
    <DateRangeProvider maxSpanDays={365}>
      {children}
    </DateRangeProvider>
  );
}
