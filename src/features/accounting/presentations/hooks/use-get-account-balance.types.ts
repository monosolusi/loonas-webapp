import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { AccountBalanceEntity } from "@/features/accounting/domain/entities/account-balance";

export type UseGetAccountBalanceParams = {
  accountId: string | null;
  startDate?: string;
  endDate?: string;
};

export type GetAccountBalanceFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  accountId: string;
  startDate?: string;
  endDate?: string;
};

type InitialState = {
  balance: null;
  loading: true;
  error: null;
};

type LoadedState = {
  balance: AccountBalanceEntity;
  loading: false;
  error: null;
};

type ErrorState = {
  balance: null;
  loading: false;
  error: ServerError;
};

export type UseGetAccountBalanceReturnType = InitialState | LoadedState | ErrorState;
