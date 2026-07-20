"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import { DateRangePicker } from "@/core/presentations/components/date-range-picker";
import { dateToIso, isoToDate } from "@/core/utilities/datetime/calendar-date";
import { useProductionList } from "@/app/(authenticated)/productions/_providers/production-list-provider";
import { useProductionRange } from "@/app/(authenticated)/productions/_providers/production-range-provider";

export function ProductionListToolbar() {
  const { search, setSearch, setPage } = useProductionList();
  const { from, to, setRange } = useProductionRange();

  const [pickerValue, setPickerValue] = useState({
    from: isoToDate(from),
    to: isoToDate(to),
  });

  useEffect(() => {
    setPickerValue({ from: isoToDate(from), to: isoToDate(to) });
  }, [from, to]);

  const committedRef = useRef<{ from: string; to: string }>({ from, to });

  const handlePickerChange = useCallback(
    (range: { from: Date | undefined; to: Date | undefined }) => {
      if (!range.from || !range.to) return;
      const nextFrom = dateToIso(range.from);
      const nextTo = dateToIso(range.to);
      if (nextFrom === committedRef.current.from && nextTo === committedRef.current.to) return;
      committedRef.current = { from: nextFrom, to: nextTo };
      setRange({ from: nextFrom, to: nextTo });
      setPage(1);
    },
    [setRange, setPage],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <TableToolbar>
      <div className="flex flex-row items-center gap-x-3">
        <DateRangePicker
          value={pickerValue}
          onChange={handlePickerChange}
          maxSpanDays={365}
          disableFutureDates={false}
        />
      </div>
      <TableSearch value={search} onChange={handleSearchChange} placeholder="Cari produk atau catatan..." />
    </TableToolbar>
  );
}
