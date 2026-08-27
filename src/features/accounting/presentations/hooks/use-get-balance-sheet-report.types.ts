import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import { GetBalanceSheetReportUseCaseResult } from "@/features/accounting/domain/usecases/get-balance-sheet-report.usecases";

export type UseGetBalanceSheetReportParams = {
  readonly asOf: string;
  readonly compareTo?: string;
};

export type GetBalanceSheetReportFetcherParams = UseGetBalanceSheetReportParams & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly refresh: KeyedMutator<GetBalanceSheetReportUseCaseResult>;
};

type LoadedState = {
  readonly data: GetBalanceSheetReportUseCaseResult;
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<GetBalanceSheetReportUseCaseResult>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: KeyedMutator<GetBalanceSheetReportUseCaseResult>;
};

export type UseGetBalanceSheetReportReturnType = InitialState | LoadedState | ErrorState;
