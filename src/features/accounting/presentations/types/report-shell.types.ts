import { ReactNode } from "react";
import { NormalizedImbalance } from "@/features/accounting/presentations/helpers/unwrap-report-response";

export type ReportDateMode = "as-of" | "range";

export type ReportShellState = "loading" | "empty" | "error" | "success";

export type ReportShellAsOfDateProps = {
  dateMode: "as-of";
  dateValue: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
};

export type ReportShellRangeDateProps = {
  dateMode: "range";
  dateValue: { from: Date | undefined; to: Date | undefined };
  onDateChange: (range: { from: Date | undefined; to: Date | undefined }) => void;
};

export type ReportShellDateProps = ReportShellAsOfDateProps | ReportShellRangeDateProps;

export type ReportShellProps = ReportShellDateProps & {
  // Formal statement title (kop laporan), e.g. "Laporan Posisi Keuangan (Neraca)".
  readonly title: string;
  // Period line shown in the statement masthead, e.g. "Per 31 Desember 2025".
  readonly periodLabel: string;
  // Plain-language, one-line description of the report for non-accountant owners.
  readonly explainer?: string;
  readonly imbalance: NormalizedImbalance | null;
  readonly state: ReportShellState;
  readonly onRetry: () => void;
  readonly children: ReactNode;
  readonly headerAction?: ReactNode;
  readonly tabStrip?: ReactNode;
  readonly controlsSlot?: ReactNode;
  // Render the centered document masthead above the body (default true). Set false for
  // interactive working papers (e.g. Buku Besar) that carry their own in-card header.
  readonly documentMasthead?: boolean;
};
