import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import { GetCalkReportUseCaseResult } from "@/features/accounting/domain/usecases/get-calk-report.usecases";

export type UseGetCalkReportParams = {
  readonly asOf: string;
};

export type GetCalkReportFetcherParams = UseGetCalkReportParams & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly refresh: null;
};

type LoadedState = {
  readonly data: GetCalkReportUseCaseResult;
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<GetCalkReportUseCaseResult>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: null;
};

export type UseGetCalkReportReturnType = InitialState | LoadedState | ErrorState;
