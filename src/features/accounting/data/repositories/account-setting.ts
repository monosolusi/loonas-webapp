import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountSettingEntity } from "@/features/accounting/domain/entities/account-setting";
import { AccountSettingRepository, UpdateAccountSettingParams } from "@/features/accounting/domain/repositories/account-setting";
import { AccountSettingService } from "@/features/accounting/domain/sources/account-setting";

export class AccountSettingRepositoryImpl implements AccountSettingRepository {
  constructor(private readonly service: AccountSettingService) {}

  public async get(session: SessionEntity): Promise<DataState<AccountSettingEntity>> {
    try {
      const model = await this.service.get(session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async update(params: UpdateAccountSettingParams, session: SessionEntity): Promise<DataState<AccountSettingEntity>> {
    try {
      const model = await this.service.update(params, session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
