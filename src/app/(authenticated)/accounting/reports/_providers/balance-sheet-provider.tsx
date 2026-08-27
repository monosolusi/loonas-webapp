"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { BalanceSheetReportEntity } from "@/features/accounting/domain/entities/balance-sheet";
import { useGetBalanceSheetReport } from "@/features/accounting/presentations/hooks/use-get-balance-sheet-report";
import { NormalizedImbalance } from "@/features/accounting/presentations/helpers/unwrap-report-response";
import { ReportShellState } from "@/features/accounting/presentations/types/report-shell.types";

type BalanceSheetContextValue = {
  asOf: string;
  dateValue: Date;
  onDateChange: (date: Date | undefined) => void;
  shellState: ReportShellState;
  imbalance: NormalizedImbalance | null;
  report: BalanceSheetReportEntity | null;
  onRetry: () => void;
};

const BalanceSheetContext = createContext<BalanceSheetContextValue | null>(null);

export function useBalanceSheetProvider(): BalanceSheetContextValue {
  const ctx = useContext(BalanceSheetContext);
  if (!ctx) throw new Error("useBalanceSheetProvider must be used within BalanceSheetProvider");
  return ctx;
}

type BalanceSheetProviderProps = {
  children: React.ReactNode;
};

export function BalanceSheetProvider({ children }: BalanceSheetProviderProps) {
  const [asOf, setAsOf] = useState<string>(() => DateTime.now().toFormat("yyyy-MM-dd"));

  const hookResult = useGetBalanceSheetReport({ asOf });

  const dateValue = useMemo(() => new Date(asOf + "T00:00:00"), [asOf]);

  const onDateChange = (date: Date | undefined) => {
    if (!date) return;
    setAsOf(DateTime.fromJSDate(date).toFormat("yyyy-MM-dd"));
  };

  const shellState = useMemo((): ReportShellState => {
    if (hookResult.error) return "error";
    if (hookResult.data && hookResult.data.sections.length === 0) return "empty";
    if (hookResult.data && hookResult.data.sections.length > 0) return "success";
    return "loading";
  }, [hookResult]);

  const imbalance = useMemo((): NormalizedImbalance | null => {
    if (!hookResult.data) return null;
    return {
      isBalanced: hookResult.data.isBalanced,
      delta: hookResult.data.imbalanceDelta,
    };
  }, [hookResult.data]);

  const report = hookResult.data ?? null;

  const onRetry = () => {
    void hookResult.refresh().catch(() => {});
  };

  return (
    <BalanceSheetContext.Provider value={{ asOf, dateValue, onDateChange, shellState, imbalance, report, onRetry }}>
      {children}
    </BalanceSheetContext.Provider>
  );
}
