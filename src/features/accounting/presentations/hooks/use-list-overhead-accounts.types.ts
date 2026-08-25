import { ServerError } from "@/core/resources/server-error";
import { OverheadAccountSelectionEntity } from "@/features/accounting/domain/entities/overhead-account-selection";

type InitialState = {
  selections: null;
  loading: true;
  error: null;
};

type LoadedState = {
  selections: OverheadAccountSelectionEntity[];
  loading: false;
  error: null;
};

type ErrorState = {
  selections: null;
  loading: false;
  error: ServerError;
};

export type UseListOverheadAccountsReturnType = InitialState | LoadedState | ErrorState;
