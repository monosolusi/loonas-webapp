"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { IncomeStatementReportEntity } from "@/features/accounting/domain/entities/income-statement";
import { useGetIncomeStatementReport } from "@/features/accounting/presentations/hooks/use-get-income-statement-report";
import { ReportShellState } from "@/features/accounting/presentations/types/report-shell.types";
import { DateRange, getMonthToDateRange, isRangeValid, toDateString } from "@/features/accounting/presentations/helpers/report-range";

type IncomeStatementContextValue = {
  dateValue: DateRange;
  onRangeChange: (range: DateRange) => void;
  compareRange: DateRange | null;
  onCompareChange: (range: DateRange | null) => void;
  shellState: ReportShellState;
  imbalance: null;
  report: IncomeStatementReportEntity | null;
  onRetry: () => void;
  rangeError: string | null;
};

const IncomeStatementContext = createContext<IncomeStatementContextValue | null>(null);

export function useIncomeStatementProvider(): IncomeStatementContextValue {
  const ctx = useContext(IncomeStatementContext);
  if (!ctx) throw new Error("useIncomeStatementProvider must be used within IncomeStatementProvider");
  return ctx;
}

type IncomeStatementProviderProps = {
  children: React.ReactNode;
};

export function IncomeStatementProvider({ children }: IncomeStatementProviderProps) {
  const [dateRange, setDateRange] = useState<DateRange>(getMonthToDateRange);
  const [compareRange, setCompareRange] = useState<DateRange | null>(null);

  const isPrimaryValid = isRangeValid(dateRange);
  const isCompareValid = compareRange !== null ? isRangeValid(compareRange) : true;
  const shouldFetch = isPrimaryValid && isCompareValid;

  const fromStr = dateRange.from ? toDateString(dateRange.from) : "";
  const toStr = dateRange.to ? toDateString(dateRange.to) : "";
  const compareFromStr = compareRange?.from ? toDateString(compareRange.from) : undefined;
  const compareToStr = compareRange?.to ? toDateString(compareRange.to) : undefined;

  const hookResult = useGetIncomeStatementReport({
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

  const report = useMemo((): IncomeStatementReportEntity | null => {
    return hookResult.data ?? null;
  }, [hookResult.data]);

  const shellState = useMemo((): ReportShellState => {
    if (!shouldFetch) return "success";
    if (hookResult.error) return "error";
    if (report !== null) {
      const hasLines =
        report.current.revenue.lines.length > 0 ||
        report.current.costOfGoodsSold.lines.length > 0 ||
        report.current.operatingExpenses.lines.length > 0 ||
        report.current.tax.lines.length > 0 ||
        (report.current.otherIncome !== null && report.current.otherIncome.lines.length > 0) ||
        (report.current.otherExpenses !== null && report.current.otherExpenses.lines.length > 0);
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
    <IncomeStatementContext.Provider
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
    </IncomeStatementContext.Provider>
  );
}
