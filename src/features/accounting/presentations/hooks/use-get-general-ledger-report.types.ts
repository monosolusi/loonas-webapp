import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import { GeneralLedgerReportData } from "@/features/accounting/domain/repositories/report";

export type UseGetGeneralLedgerReportParams = {
  readonly accountId: string;
  readonly from: string;
  readonly to: string;
  readonly page?: number;
  readonly limit?: number;
};

export type GetGeneralLedgerReportFetcherParams = UseGetGeneralLedgerReportParams & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly refresh: null;
};

type LoadedState = {
  readonly data: GeneralLedgerReportData;
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<GeneralLedgerReportData>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: null;
};

export type UseGetGeneralLedgerReportReturnType = InitialState | LoadedState | ErrorState;
