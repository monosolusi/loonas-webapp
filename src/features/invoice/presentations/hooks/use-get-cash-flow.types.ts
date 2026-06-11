import { useClerk } from "@clerk/nextjs";
import { CashFlowEntity } from "@/features/invoice/domain/entities/cash-flow";
import { ServerError } from "@/core/resources/server-error";

export type UseGetCashFlowParams = {
  month?: number;
  year?: number;
};

export type GetCashFlowFetcherParams = UseGetCashFlowParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  cashFlow: null;
  loading: true;
  error: null;
};

type LoadedState = {
  cashFlow: CashFlowEntity;
  loading: false;
  error: null;
};

type ErrorState = {
  cashFlow: null;
  loading: false;
  error: ServerError;
};

export type UseGetCashFlowReturnType = InitialState | LoadedState | ErrorState;
