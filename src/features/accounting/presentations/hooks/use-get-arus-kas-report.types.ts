import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import { ArusKasReportData } from "@/features/accounting/domain/repositories/report";

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
  readonly data: ArusKasReportData;
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<ArusKasReportData>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: null;
};

export type UseGetArusKasReportReturnType = InitialState | LoadedState | ErrorState;
