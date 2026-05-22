"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { DateTime } from "luxon";
import { DateRangePicker } from "@/core/presentations/components/date-range-picker";
import { useDashboardRange } from "@/app/(authenticated)/home/_providers/dashboard-range-provider";

function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => setDebounced(value), delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, delay]);

  return debounced;
}

function isoToDate(iso: string): Date {
  return DateTime.fromISO(iso, { zone: "Asia/Jakarta" }).toJSDate();
}

function dateToIso(date: Date): string {
  return DateTime.fromJSDate(date).setZone("Asia/Jakarta").toFormat("yyyy-MM-dd");
}

export function DashboardRangeSection() {
  const { from, to, setRange } = useDashboardRange();

  // Picker internal draft — debounce commit to provider by 250ms
  const [pickerValue, setPickerValue] = useState({
    from: isoToDate(from),
    to: isoToDate(to),
  });

  // When provider range changes externally (e.g. URL navigation), sync picker
  useEffect(() => {
    setPickerValue({ from: isoToDate(from), to: isoToDate(to) });
  }, [from, to]);

  const debouncedPickerValue = useDebounce(pickerValue, 250);

  // Commit the debounced value to the provider
  const committedRef = useRef<{ from: string; to: string }>({ from, to });
  useEffect(() => {
    if (!debouncedPickerValue.from || !debouncedPickerValue.to) return;
    const nextFrom = dateToIso(debouncedPickerValue.from);
    const nextTo = dateToIso(debouncedPickerValue.to);
    if (nextFrom !== committedRef.current.from || nextTo !== committedRef.current.to) {
      committedRef.current = { from: nextFrom, to: nextTo };
      setRange({ from: nextFrom, to: nextTo });
    }
  }, [debouncedPickerValue, setRange]);

  const handlePickerChange = useCallback((range: { from: Date | undefined; to: Date | undefined }) => {
    if (range.from && range.to) {
      setPickerValue({ from: range.from, to: range.to });
    }
  }, []);

  return (
    <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-x-2">
        <CalendarDaysIcon className="size-5 text-neutral-300" aria-hidden="true" />
        <h2 className="text-base font-semibold text-neutral-400">Ringkasan Periode</h2>
      </div>
      <DateRangePicker
        value={pickerValue}
        onChange={handlePickerChange}
        maxSpanDays={31}
        disableFutureDates={false}
      />
    </div>
  );
}
