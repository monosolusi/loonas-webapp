"use client";

import { TabFilter } from "@/core/presentations/components/tab-filter";
import { usePeriods } from "@/app/(authenticated)/finance/periods/_providers/periods-provider";

const FILTER_TABS = ["Semua", "Terbuka", "Terkunci"] as const;
const FILTER_VALUES = [undefined, "open", "closed"] as const;

export function PeriodsFilterToolbar() {
  const { statusFilter, setStatusFilter } = usePeriods();

  const selectedIndex = FILTER_VALUES.findIndex((value) => value === statusFilter);

  const handleChange = (index: number) => {
    setStatusFilter(FILTER_VALUES[index]);
  };

  return <TabFilter tabs={FILTER_TABS} selectedIndex={selectedIndex} onChange={handleChange} />;
}
