"use client";

import { TabFilter } from "@/core/presentations/components/tab-filter";
import { usePeriods } from "@/app/(authenticated)/accounting/periods/_providers/periods-provider";

const FILTER_TABS = ["Semua", "Terbuka", "Terkunci"] as const;
const FILTER_VALUES = [undefined, "open", "closed"] as const;

export function PeriodsFilterToolbar() {
  const { statusFilter, setStatusFilter } = usePeriods();

  const selectedIndex = FILTER_VALUES.findIndex((value) => value === statusFilter);

  const handleChange = (index: number) => {
    setStatusFilter(FILTER_VALUES[index]);
  };

  return (
    <div className="-mx-4 w-full overflow-x-auto px-4 sm:mx-0 sm:w-auto sm:overflow-visible sm:px-0">
      <TabFilter tabs={FILTER_TABS} selectedIndex={selectedIndex} onChange={handleChange} />
    </div>
  );
}
