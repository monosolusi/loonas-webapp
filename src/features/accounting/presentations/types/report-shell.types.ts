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
  readonly title: string;
  readonly subtitle?: string;
  readonly imbalance: NormalizedImbalance | null;
  readonly state: ReportShellState;
  readonly onRetry: () => void;
  readonly children: ReactNode;
  readonly headerAction?: ReactNode;
  readonly tabStrip?: ReactNode;
};
