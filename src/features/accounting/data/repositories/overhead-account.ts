import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import {
  OverheadAccountRepository,
  ReplaceOverheadAccountsParams,
} from "@/features/accounting/domain/repositories/overhead-account";
import { OverheadAccountSelectionEntity } from "@/features/accounting/domain/entities/overhead-account-selection";
import { OverheadAccountService } from "@/features/accounting/domain/sources/overhead-account";

export class OverheadAccountRepositoryImpl implements OverheadAccountRepository {
  constructor(private readonly service: OverheadAccountService) {}

  public async list(session: SessionEntity): Promise<DataState<OverheadAccountSelectionEntity[]>> {
    try {
      const models = await this.service.list(session);
      return new DataSuccess(models.map((m) => m.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async replace(
    params: ReplaceOverheadAccountsParams,
    session: SessionEntity,
  ): Promise<DataState<OverheadAccountSelectionEntity[]>> {
    try {
      const models = await this.service.replace(params, session);
      return new DataSuccess(models.map((m) => m.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
