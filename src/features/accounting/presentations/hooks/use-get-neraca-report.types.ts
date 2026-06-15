import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import { NeracaReportData } from "@/features/accounting/domain/repositories/report";

export type UseGetNeracaReportParams = {
  readonly asOf: string;
  readonly compareTo?: string;
};

export type GetNeracaReportFetcherParams = UseGetNeracaReportParams & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly refresh: null;
};

type LoadedState = {
  readonly data: NeracaReportData;
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<NeracaReportData>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: null;
};

export type UseGetNeracaReportReturnType = InitialState | LoadedState | ErrorState;
