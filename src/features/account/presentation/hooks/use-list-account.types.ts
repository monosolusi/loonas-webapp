import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { KeyedMutator } from "swr";
import { ServerError } from "@/core/resources/server-error";
import { useClerk } from "@clerk/nextjs";

export type ListAccountFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  accounts: null;
  loading: true;
  error: null;
  refresh: null;
};

type LoadedState = {
  accounts: AccountTypeEntity[];
  loading: false;
  error: null;
  refresh: KeyedMutator<AccountTypeEntity[]>;
};

type ErrorState = {
  accounts: null;
  loading: false;
  error: ServerError;
  refresh: null;
};

export type UseListAccountReturnType = InitialState | LoadedState | ErrorState;
