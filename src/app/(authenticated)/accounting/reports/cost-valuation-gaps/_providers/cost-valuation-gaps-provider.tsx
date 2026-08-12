"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { PaginationMeta } from "@/core/resources/paginated";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { ReportShellState } from "@/features/accounting/presentations/types/report-shell.types";
import { CostValuationGapRowEntity } from "@/features/accounting/domain/entities/cost-valuation-gap";
import { useListCostValuationGaps } from "@/features/accounting/presentations/hooks/use-list-cost-valuation-gaps";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";

type DateRange = { from: Date | undefined; to: Date | undefined };

type CostValuationGapsContextValue = {
  dateRange: DateRange;
  onRangeChange: (range: DateRange) => void;
  onClearRange: () => void;
  hasDateFilter: boolean;
  page: number;
  onPageChange: (page: number) => void;
  rows: CostValuationGapRowEntity[];
  meta: PaginationMeta | null;
  shellState: ReportShellState;
  accessDenied: boolean;
  isLoadingPage: boolean;
  pageError: ServerError | null;
  onRetry: () => void;
};

const CostValuationGapsContext = createContext<CostValuationGapsContextValue | null>(null);

export function useCostValuationGapsProvider(): CostValuationGapsContextValue {
  const ctx = useContext(CostValuationGapsContext);
  if (!ctx) throw new Error("useCostValuationGapsProvider must be used within CostValuationGapsProvider");
  return ctx;
}

type CostValuationGapsProviderProps = {
  children: React.ReactNode;
};

export function CostValuationGapsProvider({ children }: CostValuationGapsProviderProps) {
  // Default: both undefined = no filter / all unresolved gaps (NOT month-to-date).
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [page, setPage] = useState(1);

  const fromStr = dateRange.from ? DateTime.fromJSDate(dateRange.from).toFormat("yyyy-MM-dd") : undefined;
  const toStr = dateRange.to ? DateTime.fromJSDate(dateRange.to).toFormat("yyyy-MM-dd") : undefined;

  const hasDateFilter = dateRange.from !== undefined && dateRange.to !== undefined;

  const hookResult = useListCostValuationGaps({
    from: fromStr,
    to: toStr,
    page,
    limit: DEFAULT_PAGE_SIZE,
  });

  // Both-or-neither: commit only when both dates are present (apply a range) or
  // both are undefined (clear to all-period). Ignore partial picks (one set, one not).
  const onRangeChange = useCallback((range: DateRange) => {
    if (range.from !== undefined && range.to !== undefined) {
      setDateRange({ from: range.from, to: range.to });
      setPage(1);
      return;
    }
    if (range.from === undefined && range.to === undefined) {
      setDateRange({ from: undefined, to: undefined });
      setPage(1);
    }
    // Partial pick (one defined, one not) → ignore.
  }, []);

  const onClearRange = useCallback(() => {
    setDateRange({ from: undefined, to: undefined });
    setPage(1);
  }, []);

  const onPageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const rows = hookResult.data?.rows ?? [];
  const meta = hookResult.data?.meta ?? null;
  const hasData = hookResult.data !== null;
  const hookError = hookResult.error ?? null;

  // 403 FORBIDDEN from the API → feature unavailable, not a generic failure.
  // Handled independently of shellState (the view renders AccessDenied before
  // the shell-state switch), mirroring how siblings handle feature-gate 403.
  const accessDenied = hookError?.code === ErrorCodes.FORBIDDEN.code;

  const shellState = useMemo((): ReportShellState => {
    if (hookError && !hasData) return "error";
    if (hasData) return rows.length === 0 ? "empty" : "success";
    return "loading";
  }, [hookError, hasData, rows.length]);

  // A failed refetch under a new filter must show retry UI or a shimmer, not
  // silently render stale rows. Surface SWR's error even when data is present
  // (keepPreviousData keeps stale rows on refetch error).
  const pageError = hasData && hookError ? hookError : null;
  const isLoadingPage = hookResult.isLoadingPage;

  const onRetry = useCallback(() => {
    hookResult.refresh?.();
  }, [hookResult.refresh]);

  return (
    <CostValuationGapsContext.Provider
      value={{
        dateRange,
        onRangeChange,
        onClearRange,
        hasDateFilter,
        page,
        onPageChange,
        rows,
        meta,
        shellState,
        accessDenied,
        isLoadingPage,
        pageError,
        onRetry,
      }}
    >
      {children}
    </CostValuationGapsContext.Provider>
  );
}