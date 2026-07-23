"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { GeneralLedgerCounterpartEntity, GeneralLedgerReportEntity, GeneralLedgerSummaryEntity } from "@/features/accounting/domain/entities/general-ledger";
import { useGetGeneralLedgerReport } from "@/features/accounting/presentations/hooks/use-get-general-ledger-report";
import { PaginationMeta } from "@/core/resources/paginated";
import { ReportShellState } from "@/features/accounting/presentations/types/report-shell.types";
import { ServerError } from "@/core/resources/server-error";

type DateRange = { from: Date | undefined; to: Date | undefined };

type BukuBesarContextValue = {
  account: LedgerAccountEntity | null;
  onAccountChange: (account: LedgerAccountEntity | null) => void;
  dateRange: DateRange;
  onRangeChange: (range: DateRange) => void;
  page: number;
  onPageChange: (page: number) => void;
  shellState: ReportShellState;
  report: GeneralLedgerReportEntity | null;
  summary: GeneralLedgerSummaryEntity | null;
  counterpartMap: Map<string, GeneralLedgerCounterpartEntity[]>;
  meta: PaginationMeta | null;
  isLoadingPage: boolean;
  initialError: ServerError | null;
  pageError: ServerError | null;
  onRetry: () => void;
};

const BukuBesarContext = createContext<BukuBesarContextValue | null>(null);

export function useBukuBesarProvider(): BukuBesarContextValue {
  const ctx = useContext(BukuBesarContext);
  if (!ctx) throw new Error("useBukuBesarProvider must be used within BukuBesarProvider");
  return ctx;
}

type BukuBesarProviderProps = {
  children: React.ReactNode;
};

function buildCounterpartMap(counterparts: GeneralLedgerCounterpartEntity[]): Map<string, GeneralLedgerCounterpartEntity[]> {
  const map = new Map<string, GeneralLedgerCounterpartEntity[]>();
  for (const cp of counterparts) {
    const list = map.get(cp.journalEntryId) ?? [];
    list.push(cp);
    map.set(cp.journalEntryId, list);
  }
  return map;
}

function getMonthToDateRange(): DateRange {
  const now = DateTime.now();
  return {
    from: now.startOf("month").toJSDate(),
    to: now.toJSDate(),
  };
}

export function BukuBesarProvider({ children }: BukuBesarProviderProps) {
  const [account, setAccount] = useState<LedgerAccountEntity | null>(null);
  const [dateRange, setDateRange] = useState<DateRange>(getMonthToDateRange);
  const [page, setPage] = useState(1);

  const fromStr = dateRange.from ? DateTime.fromJSDate(dateRange.from).toFormat("yyyy-MM-dd") : "";
  const toStr = dateRange.to ? DateTime.fromJSDate(dateRange.to).toFormat("yyyy-MM-dd") : "";

  const shouldFetch = account !== null && fromStr !== "" && toStr !== "";

  const hookResult = useGetGeneralLedgerReport({
    accountId: account?.id ?? "",
    from: fromStr,
    to: toStr,
    page,
    enabled: shouldFetch,
  });

  const onAccountChange = useCallback((newAccount: LedgerAccountEntity | null) => {
    setAccount(newAccount);
    setPage(1);
  }, []);

  const onRangeChange = useCallback((range: DateRange) => {
    setDateRange(range);
    setPage(1);
  }, []);

  const onPageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const hasData = hookResult.data !== null;
  const hookError = hookResult.error ?? null;

  const shellState = useMemo((): ReportShellState => {
    if (!shouldFetch) return "success";
    if (hookError && !hasData) return "error";
    if (hasData) return "success";
    return "loading";
  }, [shouldFetch, hookError, hasData]);

  const report = hookResult.data?.data ?? null;
  const summary = report?.summary ?? null;
  const paginationMeta = hookResult.data?.meta ?? null;

  const counterpartMap = useMemo(
    () => buildCounterpartMap(report?.counterparts ?? []),
    [report?.counterparts],
  );

  const initialError = !hasData && hookError ? hookError : null;
  const pageError = hasData && hookError ? hookError : null;

  const isLoadingPage = hookResult.loading === false && hookResult.error === null
    ? hookResult.isLoadingPage
    : false;

  const onRetry = useCallback(() => {
    hookResult.refresh?.();
  }, [hookResult]);

  return (
    <BukuBesarContext.Provider
      value={{
        account,
        onAccountChange,
        dateRange,
        onRangeChange,
        page,
        onPageChange,
        shellState,
        report,
        summary,
        counterpartMap,
        meta: paginationMeta,
        isLoadingPage,
        initialError,
        pageError,
        onRetry,
      }}
    >
      {children}
    </BukuBesarContext.Provider>
  );
}
