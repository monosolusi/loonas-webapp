"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { NotesReportEntity } from "@/features/accounting/domain/entities/notes";
import { useGetNotesReport } from "@/features/accounting/presentations/hooks/use-get-notes-report";
import { ReportShellState } from "@/features/accounting/presentations/types/report-shell.types";

type NotesContextValue = {
  asOf: string;
  dateValue: Date;
  onDateChange: (date: Date | undefined) => void;
  shellState: ReportShellState;
  report: NotesReportEntity | null;
  onRetry: () => void;
};

const NotesContext = createContext<NotesContextValue | null>(null);

export function useNotesProvider(): NotesContextValue {
  const ctx = useContext(NotesContext);
  if (!ctx) throw new Error("useNotesProvider must be used within NotesProvider");
  return ctx;
}

type NotesProviderProps = {
  children: React.ReactNode;
};

export function NotesProvider({ children }: NotesProviderProps) {
  const [asOf, setAsOf] = useState<string>(() => DateTime.now().toFormat("yyyy-MM-dd"));

  const hookResult = useGetNotesReport({ asOf });

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
    <NotesContext.Provider value={{ asOf, dateValue, onDateChange, shellState, report, onRetry }}>
      {children}
    </NotesContext.Provider>
  );
}
