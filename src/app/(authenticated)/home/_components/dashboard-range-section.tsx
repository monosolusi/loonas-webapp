"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
    <div className="flex items-center justify-between border-b border-neutral-100 py-3">
      <span className="text-sm text-neutral-300">Periode ditampilkan</span>
      <DateRangePicker
        value={pickerValue}
        onChange={handlePickerChange}
        maxSpanDays={31}
        disableFutureDates={false}
      />
    </div>
  );
}
