import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { ServerError } from "@/core/resources/server-error";

type InitialState = {
  accounts: null;
  loading: true;
  error: null;
};

type LoadedState = {
  accounts: AccountTypeEntity[];
  loading: false;
  error: null;
};

type ErrorState = {
  accounts: null;
  loading: false;
  error: ServerError;
};

export type UseListApprovedAccountsReturnType = InitialState | LoadedState | ErrorState;
