import { useClerk } from "@clerk/nextjs";
import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { ListCostValuationGapsUseCaseResult } from "@/features/accounting/domain/usecases/list-cost-valuation-gaps.usecases";

export type UseListCostValuationGapsParams = {
  readonly from?: string;
  readonly to?: string;
  readonly page?: number;
  readonly limit?: number;
  readonly enabled?: boolean;
};

export type ListCostValuationGapsFetcherParams = UseListCostValuationGapsParams & {
  readonly clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  readonly data: null;
  readonly loading: true;
  readonly isLoadingPage: false;
  readonly error: null;
  readonly refresh: null;
};

type LoadedState = {
  readonly data: ListCostValuationGapsUseCaseResult;
  readonly loading: false;
  readonly isLoadingPage: boolean;
  readonly error: ServerError | null;
  readonly refresh: KeyedMutator<ListCostValuationGapsUseCaseResult>;
};

type ErrorState = {
  readonly data: null;
  readonly loading: false;
  readonly isLoadingPage: false;
  readonly error: ServerError;
  readonly refresh: () => void;
};

export type UseListCostValuationGapsReturnType = InitialState | LoadedState | ErrorState;