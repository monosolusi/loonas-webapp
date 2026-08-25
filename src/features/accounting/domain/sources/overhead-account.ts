import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { OverheadAccountSelectionModel } from "@/features/accounting/data/models/overhead-account-selection";

export type ReplaceOverheadAccountsServiceParams = {
  accountIds: string[];
};

export interface OverheadAccountService {
  list(session: SessionEntity): Promise<OverheadAccountSelectionModel[]>;
  replace(
    params: ReplaceOverheadAccountsServiceParams,
    session: SessionEntity,
  ): Promise<OverheadAccountSelectionModel[]>;
}
