"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { TrialBalanceReportEntity } from "@/features/accounting/domain/entities/trial-balance";
import { useGetTrialBalanceReport } from "@/features/accounting/presentations/hooks/use-get-trial-balance-report";
import { NormalizedImbalance } from "@/features/accounting/presentations/helpers/unwrap-report-response";
import { ReportShellState } from "@/features/accounting/presentations/types/report-shell.types";

type TrialBalanceContextValue = {
  asOf: string;
  fiscalYearStart: string;
  dateValue: Date;
  onDateChange: (date: Date | undefined) => void;
  includeZero: boolean;
  onToggleIncludeZero: () => void;
  shellState: ReportShellState;
  imbalance: NormalizedImbalance | null;
  report: TrialBalanceReportEntity | null;
  expandedAccountId: string | null;
  onToggleExpand: (accountId: string) => void;
  onRetry: () => void;
};

const TrialBalanceContext = createContext<TrialBalanceContextValue | null>(null);

export function useTrialBalanceProvider(): TrialBalanceContextValue {
  const ctx = useContext(TrialBalanceContext);
  if (!ctx) throw new Error("useTrialBalanceProvider must be used within TrialBalanceProvider");
  return ctx;
}

type TrialBalanceProviderProps = {
  children: React.ReactNode;
};

export function TrialBalanceProvider({ children }: TrialBalanceProviderProps) {
  const [asOf, setAsOf] = useState<string>(() => DateTime.now().toFormat("yyyy-MM-dd"));
  const [includeZero, setIncludeZero] = useState<boolean>(false);
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);

  const hookResult = useGetTrialBalanceReport({ asOf, includeZero });

  const dateValue = useMemo(() => new Date(asOf + "T00:00:00"), [asOf]);

  const onDateChange = useCallback((date: Date | undefined) => {
    if (!date) return;
    setAsOf(DateTime.fromJSDate(date).toFormat("yyyy-MM-dd"));
    setExpandedAccountId(null);
  }, []);

  const onToggleIncludeZero = useCallback(() => {
    setIncludeZero((prev) => !prev);
    setExpandedAccountId(null);
  }, []);

  const onToggleExpand = useCallback((accountId: string) => {
    setExpandedAccountId((prev) => (prev === accountId ? null : accountId));
  }, []);

  const shellState = useMemo((): ReportShellState => {
    if (hookResult.error) return "error";
    if (hookResult.data && hookResult.data.groups.length === 0) return "empty";
    if (hookResult.data && hookResult.data.groups.length > 0) return "success";
    return "loading";
  }, [hookResult]);

  const imbalance = useMemo((): NormalizedImbalance | null => {
    if (!hookResult.data) return null;
    return {
      isBalanced: hookResult.data.isBalanced,
      delta: hookResult.data.imbalanceDelta,
    };
  }, [hookResult.data]);

  const fiscalYearStart = hookResult.data?.fiscalYearStart ?? "";
  const report = hookResult.data ?? null;

  const onRetry = useCallback(() => {
    hookResult.refresh?.();
  }, [hookResult]);

  return (
    <TrialBalanceContext.Provider
      value={{
        asOf,
        fiscalYearStart,
        dateValue,
        onDateChange,
        includeZero,
        onToggleIncludeZero,
        shellState,
        imbalance,
        report,
        expandedAccountId,
        onToggleExpand,
        onRetry,
      }}
    >
      {children}
    </TrialBalanceContext.Provider>
  );
}
