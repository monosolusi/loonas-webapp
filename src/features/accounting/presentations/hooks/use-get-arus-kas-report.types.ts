import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import { GetArusKasReportUseCaseResult } from "@/features/accounting/domain/usecases/get-arus-kas-report.usecases";

export type UseGetArusKasReportParams = {
  readonly enabled: boolean;
  readonly from: string;
  readonly to: string;
};

export type GetArusKasReportFetcherParams = Omit<UseGetArusKasReportParams, "enabled"> & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly refresh: null;
};

type LoadedState = {
  readonly data: GetArusKasReportUseCaseResult;
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<GetArusKasReportUseCaseResult>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: null;
};

export type UseGetArusKasReportReturnType = InitialState | LoadedState | ErrorState;
