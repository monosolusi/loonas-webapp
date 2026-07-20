import { useClerk } from "@clerk/nextjs";
import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { ListTrialBalanceLinesUseCaseResult } from "@/features/accounting/domain/usecases/list-trial-balance-lines.usecases";

export type UseListTrialBalanceLinesParams = {
  readonly accountId: string;
  readonly from?: string;
  readonly to?: string;
  readonly page?: number;
  readonly limit?: number;
  readonly enabled?: boolean;
};

export type ListTrialBalanceLineFetcherParams = UseListTrialBalanceLinesParams & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly error: null;
  readonly refresh: null;
};

type LoadedState = {
  readonly data: ListTrialBalanceLinesUseCaseResult;
  readonly loading: false;
  readonly error: null;
  readonly refresh: KeyedMutator<ListTrialBalanceLinesUseCaseResult>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly error: ServerError;
  readonly refresh: null;
};

export type UseListTrialBalanceLinesReturnType = InitialState | LoadedState | ErrorState;
