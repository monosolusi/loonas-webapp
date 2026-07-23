import { ServerError } from "@/core/resources/server-error";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";

type InitialState = {
  accounts: null;
  loading: true;
  error: null;
};

type LoadedState = {
  accounts: LedgerAccountEntity[];
  loading: false;
  error: null;
};

type ErrorState = {
  accounts: null;
  loading: false;
  error: ServerError;
};

export type UseListAllLedgerAccountsReturnType = InitialState | LoadedState | ErrorState;
