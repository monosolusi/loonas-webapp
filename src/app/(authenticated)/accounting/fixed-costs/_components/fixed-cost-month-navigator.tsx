"use client";

import { useFixedCostEntries } from "@/app/(authenticated)/accounting/fixed-costs/_providers/fixed-cost-entries-provider";
import { MonthNavigator } from "@/app/(authenticated)/accounting/fixed-costs/_components/month-navigator";

export function FixedCostMonthNavigator() {
  const { year, month, setMonth } = useFixedCostEntries();

  return <MonthNavigator year={year} month={month} onChange={setMonth} />;
}
