import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import { TrialBalanceReportData } from "@/features/accounting/domain/repositories/report";

export type UseGetTrialBalanceReportParams = {
  readonly asOf: string;
  readonly includeZero?: boolean;
};

export type GetTrialBalanceReportFetcherParams = UseGetTrialBalanceReportParams & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly refresh: null;
};

type LoadedState = {
  readonly data: TrialBalanceReportData;
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<TrialBalanceReportData>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: null;
};

export type UseGetTrialBalanceReportReturnType = InitialState | LoadedState | ErrorState;
