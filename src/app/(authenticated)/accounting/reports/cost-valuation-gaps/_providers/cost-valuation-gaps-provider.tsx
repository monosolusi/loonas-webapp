"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { DateTime } from "luxon";
import { PaginationMeta } from "@/core/resources/paginated";
import { ServerError } from "@/core/resources/server-error";
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
  loading: boolean;
  error: ServerError | null;
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

  const loading = hookResult.loading;

  const onRetry = useCallback(() => {
    hookResult.refresh?.();
  }, [hookResult]);

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
        loading,
        error: hookResult.error ?? null,
        onRetry,
      }}
    >
      {children}
    </CostValuationGapsContext.Provider>
  );
}