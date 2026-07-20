"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { DateRangePicker } from "@/core/presentations/components/date-range-picker";
import { dateToIso, isoToDate } from "@/core/utilities/datetime/calendar-date";
import { usePosSalesList } from "@/app/(authenticated)/sales/pos/_providers/pos-sales-list-provider";
import { usePosSalesRange } from "@/app/(authenticated)/sales/pos/_providers/pos-sales-range-provider";

export function PosSalesListToolbar() {
  const { setPage } = usePosSalesList();
  const { from, to, setRange } = usePosSalesRange();

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

  return (
    <TableToolbar>
      <div className="flex flex-row items-center gap-x-3">
        <DateRangePicker value={pickerValue} onChange={handlePickerChange} maxSpanDays={365} disableFutureDates={false} />
      </div>
    </TableToolbar>
  );
}