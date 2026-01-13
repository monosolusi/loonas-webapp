import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";

export type GetAccountFetcherParams = {
  getToken: () => Promise<string | null>;
};

type InitalState = {
  account: null;
  loading: true;
  error: null;
  refresh: null;
};

type LoadedState = {
  account: AccountTypeEntity;
  loading: false;
  error: null;
  refresh: KeyedMutator<AccountTypeEntity>;
};

type ErrorState = {
  account: null;
  loading: false;
  error: ServerError;
  refresh: null;
};

export type UseGetCurrentAccountReturnValue = InitalState | LoadedState | ErrorState;
