"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { CalkReportEntity } from "@/features/accounting/domain/entities/calk";
import { useGetCalkReport } from "@/features/accounting/presentations/hooks/use-get-calk-report";
import { ReportShellState } from "@/features/accounting/presentations/types/report-shell.types";

type CalkContextValue = {
  asOf: string;
  dateValue: Date;
  onDateChange: (date: Date | undefined) => void;
  shellState: ReportShellState;
  report: CalkReportEntity | null;
  onRetry: () => void;
};

const CalkContext = createContext<CalkContextValue | null>(null);

export function useCalkProvider(): CalkContextValue {
  const ctx = useContext(CalkContext);
  if (!ctx) throw new Error("useCalkProvider must be used within CalkProvider");
  return ctx;
}

type CalkProviderProps = {
  children: React.ReactNode;
};

export function CalkProvider({ children }: CalkProviderProps) {
  const [asOf, setAsOf] = useState<string>(() => DateTime.now().toFormat("yyyy-MM-dd"));

  const hookResult = useGetCalkReport({ asOf });

  const dateValue = useMemo(() => new Date(asOf + "T00:00:00"), [asOf]);

  const onDateChange = (date: Date | undefined) => {
    if (!date) return;
    setAsOf(DateTime.fromJSDate(date).toFormat("yyyy-MM-dd"));
  };

  const shellState = useMemo((): ReportShellState => {
    if (hookResult.error) return "error";
    if (hookResult.data && hookResult.data.notes.length === 0) return "empty";
    if (hookResult.data) return "success";
    return "loading";
  }, [hookResult]);

  const report = hookResult.data ?? null;

  const onRetry = () => {
    hookResult.refresh?.();
  };

  return (
    <CalkContext.Provider value={{ asOf, dateValue, onDateChange, shellState, report, onRetry }}>
      {children}
    </CalkContext.Provider>
  );
}
