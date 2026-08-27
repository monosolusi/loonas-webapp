import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";
import { GetGeneralLedgerReportUseCaseResult } from "@/features/accounting/domain/usecases/get-general-ledger-report.usecases";

export type UseGetGeneralLedgerReportParams = {
  readonly accountId: string;
  readonly from: string;
  readonly to: string;
  readonly page?: number;
  readonly limit?: number;
  readonly enabled?: boolean;
};

export type GetGeneralLedgerReportFetcherParams = UseGetGeneralLedgerReportParams & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly isLoadingPage: false;
  readonly error: null;
  readonly refresh: KeyedMutator<GetGeneralLedgerReportUseCaseResult>;
};

type LoadedState = {
  readonly data: GetGeneralLedgerReportUseCaseResult;
  readonly loading: false;
  readonly isLoadingPage: boolean;
  readonly error: ServerError | null;
  readonly refresh: KeyedMutator<GetGeneralLedgerReportUseCaseResult>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly isLoadingPage: false;
  readonly error: ServerError;
  readonly refresh: KeyedMutator<GetGeneralLedgerReportUseCaseResult>;
};

export type UseGetGeneralLedgerReportReturnType = InitialState | LoadedState | ErrorState;
