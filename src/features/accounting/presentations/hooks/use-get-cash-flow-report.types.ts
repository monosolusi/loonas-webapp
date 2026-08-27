import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import { GetCashFlowReportUseCaseResult } from "@/features/accounting/domain/usecases/get-cash-flow-report.usecases";

export type UseGetCashFlowReportParams = {
  readonly enabled: boolean;
  readonly from: string;
  readonly to: string;
};

export type GetCashFlowReportFetcherParams = Omit<UseGetCashFlowReportParams, "enabled"> & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly refresh: KeyedMutator<GetCashFlowReportUseCaseResult>;
};

type LoadedState = {
  readonly data: GetCashFlowReportUseCaseResult;
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<GetCashFlowReportUseCaseResult>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: KeyedMutator<GetCashFlowReportUseCaseResult>;
};

export type UseGetCashFlowReportReturnType = InitialState | LoadedState | ErrorState;
