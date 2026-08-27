"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { PaginationMeta } from "@/core/resources/paginated";
import { ServerError } from "@/core/resources/server-error";
import { ReportShellState } from "@/features/accounting/presentations/types/report-shell.types";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { useListCashEntries } from "@/features/accounting/presentations/hooks/use-list-cash-entries";
import {
  parseDirectionParam,
  resolveListParams,
} from "@/app/(authenticated)/accounting/cash-entries/_utils/cash-entries-filters";

type DateRange = { from: Date | undefined; to: Date | undefined };

type CashEntriesListContextValue = {
  dateRange: DateRange;
  onRangeChange: (range: DateRange) => void;
  onClearRange: () => void;
  hasDateFilter: boolean;
  direction: CashEntryDirection | undefined;
  onDirectionChange: (direction: CashEntryDirection | undefined) => void;
  page: number;
  onPageChange: (page: number) => void;
  entries: CashEntryEntity[];
  meta: PaginationMeta | null;
  shellState: ReportShellState;
  isLoadingPage: boolean;
  pageError: ServerError | null;
  onRetry: () => void;
};

const CashEntriesListContext = createContext<CashEntriesListContextValue | null>(null);

export function useCashEntriesListProvider(): CashEntriesListContextValue {
  const ctx = useContext(CashEntriesListContext);
  if (!ctx) throw new Error("useCashEntriesListProvider must be used within CashEntriesListProvider");
  return ctx;
}

type CashEntriesListProviderProps = {
  children: React.ReactNode;
};

export function CashEntriesListProvider({ children }: CashEntriesListProviderProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  // Both undefined = no filter (not month-to-date). Date range stays in provider state — only
  // `direction` is URL-persisted (AC-3 asks for reload-survival on direction alone).
  const [dateRange, setDateRange] = useState<DateRange>({ from: undefined, to: undefined });
  const [page, setPage] = useState(1);

  // `direction` is derived directly from the URL param on every render — `parseDirectionParam`
  // is pure and cheap, so there is no need to mirror it into local state (which would lag the
  // URL by a commit, e.g. on back/forward navigation or right after a tab click).
  const directionParam = searchParams.get("direction");
  const direction = useMemo(() => parseDirectionParam(directionParam), [directionParam]);

  const hasDateFilter = dateRange.from !== undefined && dateRange.to !== undefined;

  const listParams = useMemo(
    () => resolveListParams({ page, direction, range: dateRange }),
    [page, direction, dateRange],
  );

  const hookResult = useListCashEntries(listParams);

  // Both-or-neither: commit only when both dates are present (apply a range) or both are
  // undefined (clear to all-period). Ignore a partial pick (one set, one not).
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
  }, []);

  const onClearRange = useCallback(() => {
    setDateRange({ from: undefined, to: undefined });
    setPage(1);
  }, []);

  const onDirectionChange = useCallback(
    (next: CashEntryDirection | undefined) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next) params.set("direction", next);
      else params.delete("direction");
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
      setPage(1);
    },
    [searchParams, router, pathname],
  );

  const onPageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const entries = hookResult.entries ?? [];
  const meta = hookResult.meta ?? null;
  const hasData = hookResult.entries !== null;
  const hookError = hookResult.error ?? null;

  const shellState = useMemo((): ReportShellState => {
    if (hookError && !hasData) return "error";
    if (hasData) return entries.length === 0 ? "empty" : "success";
    return "loading";
  }, [hookError, hasData, entries.length]);

  // A failed refetch under a new filter must show retry UI, not silently render stale rows.
  // Surface SWR's error even when data is present (keepPreviousData keeps stale rows on
  // refetch error).
  const pageError = hasData && hookError ? hookError : null;
  const isLoadingPage = hookResult.isLoadingPage;

  // A bound SWR `mutate()` triggers a refetch and defaults to `throwOnError: true`, so a retry
  // that fails again would otherwise reject unhandled out of this onClick handler. Swallow it
  // deliberately — SWR leaves `error` populated on a failed refetch, so the error UI stays on
  // screen without this handler needing to do anything further.
  const onRetry = useCallback(() => {
    void hookResult.refresh?.()?.catch(() => {});
  }, [hookResult.refresh]);

  return (
    <CashEntriesListContext.Provider
      value={{
        dateRange,
        onRangeChange,
        onClearRange,
        hasDateFilter,
        direction,
        onDirectionChange,
        page,
        onPageChange,
        entries,
        meta,
        shellState,
        isLoadingPage,
        pageError,
        onRetry,
      }}
    >
      {children}
    </CashEntriesListContext.Provider>
  );
}
