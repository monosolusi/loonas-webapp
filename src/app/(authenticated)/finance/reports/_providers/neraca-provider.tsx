"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { NeracaReportEntity } from "@/features/accounting/domain/entities/neraca";
import { useGetNeracaReport } from "@/features/accounting/presentations/hooks/use-get-neraca-report";
import { NormalizedImbalance } from "@/features/accounting/presentations/helpers/unwrap-report-response";
import { ReportShellState } from "@/features/accounting/presentations/types/report-shell.types";

type NeracaContextValue = {
  asOf: string;
  dateValue: Date;
  onDateChange: (date: Date | undefined) => void;
  shellState: ReportShellState;
  imbalance: NormalizedImbalance | null;
  report: NeracaReportEntity | null;
  onRetry: () => void;
};

const NeracaContext = createContext<NeracaContextValue | null>(null);

export function useNeracaProvider(): NeracaContextValue {
  const ctx = useContext(NeracaContext);
  if (!ctx) throw new Error("useNeracaProvider must be used within NeracaProvider");
  return ctx;
}

type NeracaProviderProps = {
  children: React.ReactNode;
};

export function NeracaProvider({ children }: NeracaProviderProps) {
  const [asOf, setAsOf] = useState<string>(() => DateTime.now().toFormat("yyyy-MM-dd"));

  const hookResult = useGetNeracaReport({ asOf });

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
    if (hookResult.refresh) {
      hookResult.refresh();
    }
  };

  return (
    <NeracaContext.Provider value={{ asOf, dateValue, onDateChange, shellState, imbalance, report, onRetry }}>
      {children}
    </NeracaContext.Provider>
  );
}
