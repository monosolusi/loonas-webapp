import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { OverheadAccountSelectionEntity } from "@/features/accounting/domain/entities/overhead-account-selection";

export type ReplaceOverheadAccountsParams = {
  accountIds: string[];
};

export interface OverheadAccountRepository {
  list(session: SessionEntity): Promise<DataState<OverheadAccountSelectionEntity[]>>;
  replace(
    params: ReplaceOverheadAccountsParams,
    session: SessionEntity,
  ): Promise<DataState<OverheadAccountSelectionEntity[]>>;
}
