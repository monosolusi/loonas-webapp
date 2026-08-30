import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CashEntrySettingsEntity } from "@/features/accounting/domain/entities/cash-entry-settings";
import {
  CashEntrySettingsRepository,
  UpdateCashEntrySettingsParams,
} from "@/features/accounting/domain/repositories/cash-entry-settings";
import { CashEntrySettingsService } from "@/features/accounting/domain/sources/cash-entry-settings";

export class CashEntrySettingsRepositoryImpl implements CashEntrySettingsRepository {
  constructor(private readonly service: CashEntrySettingsService) {}

  public async get(session: SessionEntity): Promise<DataState<CashEntrySettingsEntity>> {
    try {
      const model = await this.service.get(session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async update(
    params: UpdateCashEntrySettingsParams,
    session: SessionEntity,
  ): Promise<DataState<CashEntrySettingsEntity>> {
    try {
      const model = await this.service.update(params, session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
