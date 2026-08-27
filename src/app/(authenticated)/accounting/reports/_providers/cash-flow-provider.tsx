"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CashFlowReportEntity } from "@/features/accounting/domain/entities/cash-flow";
import { useGetCashFlowReport } from "@/features/accounting/presentations/hooks/use-get-cash-flow-report";
import { NormalizedImbalance } from "@/features/accounting/presentations/helpers/unwrap-report-response";
import { ReportShellState } from "@/features/accounting/presentations/types/report-shell.types";
import { DateRange, getMonthToDateRange, isRangeValid, toDateString } from "@/features/accounting/presentations/helpers/report-range";

type CashFlowContextValue = {
  dateValue: DateRange;
  onRangeChange: (range: DateRange) => void;
  shellState: ReportShellState;
  imbalance: NormalizedImbalance | null;
  report: CashFlowReportEntity | null;
  onRetry: () => void;
  rangeError: string | null;
};

const CashFlowContext = createContext<CashFlowContextValue | null>(null);

export function useCashFlowProvider(): CashFlowContextValue {
  const ctx = useContext(CashFlowContext);
  if (!ctx) throw new Error("useCashFlowProvider must be used within CashFlowProvider");
  return ctx;
}

type CashFlowProviderProps = {
  children: React.ReactNode;
};

export function CashFlowProvider({ children }: CashFlowProviderProps) {
  const [dateRange, setDateRange] = useState<DateRange>(getMonthToDateRange);

  const shouldFetch = isRangeValid(dateRange);

  const fromStr = dateRange.from ? toDateString(dateRange.from) : "";
  const toStr = dateRange.to ? toDateString(dateRange.to) : "";

  const hookResult = useGetCashFlowReport({ enabled: shouldFetch, from: fromStr, to: toStr });

  const rangeError = useMemo((): string | null => {
    if (!shouldFetch && dateRange.from && dateRange.to) {
      return "Rentang tanggal harus dalam tahun yang sama dan tanggal mulai tidak boleh lebih besar dari tanggal selesai.";
    }
    return null;
  }, [shouldFetch, dateRange]);

  const report = useMemo((): CashFlowReportEntity | null => {
    return hookResult.data ?? null;
  }, [hookResult.data]);

  const shellState = useMemo((): ReportShellState => {
    if (!shouldFetch) return "success";
    if (hookResult.error) return "error";
    if (report !== null) {
      const isEmpty =
        report.operating.adjustments.length === 0 &&
        report.operating.workingCapitalChanges.length === 0 &&
        report.investing.lines.length === 0 &&
        report.financing.lines.length === 0 &&
        report.totalCashFlow === 0 &&
        report.openingCashBalance === 0 &&
        report.closingCashBalance === 0;
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
    void hookResult.refresh().catch(() => {});
  }, [hookResult]);

  return (
    <CashFlowContext.Provider
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
    </CashFlowContext.Provider>
  );
}
