"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { LabaRugiReportEntity } from "@/features/accounting/domain/entities/laba-rugi";
import { useGetLabaRugiReport } from "@/features/accounting/presentations/hooks/use-get-laba-rugi-report";
import { ReportShellState } from "@/features/accounting/presentations/types/report-shell.types";
import { DateRange, getMonthToDateRange, isRangeValid, toDateString } from "@/features/accounting/presentations/helpers/report-range";

type LabaRugiContextValue = {
  dateValue: DateRange;
  onRangeChange: (range: DateRange) => void;
  compareRange: DateRange | null;
  onCompareChange: (range: DateRange | null) => void;
  shellState: ReportShellState;
  imbalance: null;
  report: LabaRugiReportEntity | null;
  onRetry: () => void;
  rangeError: string | null;
};

const LabaRugiContext = createContext<LabaRugiContextValue | null>(null);

export function useLabaRugiProvider(): LabaRugiContextValue {
  const ctx = useContext(LabaRugiContext);
  if (!ctx) throw new Error("useLabaRugiProvider must be used within LabaRugiProvider");
  return ctx;
}

type LabaRugiProviderProps = {
  children: React.ReactNode;
};

export function LabaRugiProvider({ children }: LabaRugiProviderProps) {
  const [dateRange, setDateRange] = useState<DateRange>(getMonthToDateRange);
  const [compareRange, setCompareRange] = useState<DateRange | null>(null);

  const isPrimaryValid = isRangeValid(dateRange);
  const isCompareValid = compareRange !== null ? isRangeValid(compareRange) : true;
  const shouldFetch = isPrimaryValid && isCompareValid;

  const fromStr = dateRange.from ? toDateString(dateRange.from) : "";
  const toStr = dateRange.to ? toDateString(dateRange.to) : "";
  const compareFromStr = compareRange?.from ? toDateString(compareRange.from) : undefined;
  const compareToStr = compareRange?.to ? toDateString(compareRange.to) : undefined;

  const hookResult = useGetLabaRugiReport({
    enabled: shouldFetch,
    from: fromStr,
    to: toStr,
    compareFrom: shouldFetch && compareRange !== null ? compareFromStr : undefined,
    compareTo: shouldFetch && compareRange !== null ? compareToStr : undefined,
  });

  const rangeError = useMemo((): string | null => {
    if (!shouldFetch && dateRange.from && dateRange.to) {
      return "Rentang tanggal harus dalam tahun yang sama dan tanggal mulai tidak boleh lebih besar dari tanggal selesai.";
    }
    if (!shouldFetch && compareRange !== null) {
      return "Rentang periode pembanding harus dalam tahun yang sama.";
    }
    return null;
  }, [shouldFetch, dateRange, compareRange]);

  const report = useMemo((): LabaRugiReportEntity | null => {
    return hookResult.data ?? null;
  }, [hookResult.data]);

  const shellState = useMemo((): ReportShellState => {
    if (!shouldFetch) return "success";
    if (hookResult.error) return "error";
    if (report !== null) {
      const hasLines =
        report.current.pendapatan.lines.length > 0 ||
        report.current.hargaPokokPenjualan.lines.length > 0 ||
        report.current.biayaOperasional.lines.length > 0 ||
        report.current.pajak.lines.length > 0 ||
        (report.current.pendapatanLainLain !== null && report.current.pendapatanLainLain.lines.length > 0) ||
        (report.current.bebanLainLain !== null && report.current.bebanLainLain.lines.length > 0);
      return hasLines ? "success" : "empty";
    }
    return "loading";
  }, [shouldFetch, hookResult.error, report]);

  const onRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
  }, []);

  const onCompareChange = useCallback((range: DateRange | null) => {
    setCompareRange(range);
  }, []);

  const onRetry = useCallback(() => {
    hookResult.refresh?.();
  }, [hookResult]);

  return (
    <LabaRugiContext.Provider
      value={{
        dateValue: dateRange,
        onRangeChange,
        compareRange,
        onCompareChange,
        shellState,
        imbalance: null,
        report,
        onRetry,
        rangeError,
      }}
    >
      {children}
    </LabaRugiContext.Provider>
  );
}
