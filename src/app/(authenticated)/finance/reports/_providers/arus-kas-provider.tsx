"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { ArusKasReportEntity } from "@/features/accounting/domain/entities/arus-kas";
import { useGetArusKasReport } from "@/features/accounting/presentations/hooks/use-get-arus-kas-report";
import { NormalizedImbalance } from "@/features/accounting/presentations/helpers/unwrap-report-response";
import { ReportShellState } from "@/features/accounting/presentations/types/report-shell.types";
import { DateRange, getMonthToDateRange, isRangeValid, toDateString } from "@/features/accounting/presentations/helpers/report-range";

type ArusKasContextValue = {
  dateValue: DateRange;
  onRangeChange: (range: DateRange) => void;
  shellState: ReportShellState;
  imbalance: NormalizedImbalance | null;
  report: ArusKasReportEntity | null;
  onRetry: () => void;
  rangeError: string | null;
};

const ArusKasContext = createContext<ArusKasContextValue | null>(null);

export function useArusKasProvider(): ArusKasContextValue {
  const ctx = useContext(ArusKasContext);
  if (!ctx) throw new Error("useArusKasProvider must be used within ArusKasProvider");
  return ctx;
}

type ArusKasProviderProps = {
  children: React.ReactNode;
};

export function ArusKasProvider({ children }: ArusKasProviderProps) {
  const [dateRange, setDateRange] = useState<DateRange>(getMonthToDateRange);

  const shouldFetch = isRangeValid(dateRange);

  const fromStr = dateRange.from ? toDateString(dateRange.from) : "";
  const toStr = dateRange.to ? toDateString(dateRange.to) : "";

  const hookResult = useGetArusKasReport({ enabled: shouldFetch, from: fromStr, to: toStr });

  const rangeError = useMemo((): string | null => {
    if (!shouldFetch && dateRange.from && dateRange.to) {
      return "Rentang tanggal harus dalam tahun yang sama dan tanggal mulai tidak boleh lebih besar dari tanggal selesai.";
    }
    return null;
  }, [shouldFetch, dateRange]);

  const report = useMemo((): ArusKasReportEntity | null => {
    return hookResult.data ?? null;
  }, [hookResult.data]);

  const shellState = useMemo((): ReportShellState => {
    if (!shouldFetch) return "success";
    if (hookResult.error) return "error";
    if (report !== null) {
      const isEmpty =
        report.operasi.penyesuaian.length === 0 &&
        report.operasi.perubahanModalKerja.length === 0 &&
        report.investasi.lines.length === 0 &&
        report.pendanaan.lines.length === 0 &&
        report.totalArusKas === 0 &&
        report.saldoKasAwal === 0 &&
        report.saldoKasAkhir === 0;
      return isEmpty ? "empty" : "success";
    }
    return "loading";
  }, [shouldFetch, hookResult.error, report]);

  const imbalance = useMemo((): NormalizedImbalance | null => {
    if (!report) return null;
    return {
      isBalanced: report.isBalanced,
      delta: report.imbalanceDelta,
    };
  }, [report]);

  const onRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
  }, []);

  const onRetry = useCallback(() => {
    hookResult.refresh?.();
  }, [hookResult]);

  return (
    <ArusKasContext.Provider
      value={{
        dateValue: dateRange,
        onRangeChange,
        shellState,
        imbalance,
        report,
        onRetry,
        rangeError,
      }}
    >
      {children}
    </ArusKasContext.Provider>
  );
}
