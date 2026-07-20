"use client";

import { DateRangeProvider, useDateRange, type DateRange } from "@/core/presentations/providers/date-range-provider";

type DashboardRangeContextValue = {
  from: string;
  to: string;
  setRange: (next: DateRange) => void;
  isRangeInvalid: boolean;
};

export function useDashboardRange(): DashboardRangeContextValue {
  return useDateRange();
}

type DashboardRangeProviderProps = {
  children: React.ReactNode;
};

export function DashboardRangeProvider({ children }: DashboardRangeProviderProps) {
  return (
    <DateRangeProvider maxSpanDays={31}>
      {children}
    </DateRangeProvider>
  );
}
