import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";
import {
  FinalIncomeTaxSettleRepository,
  SettleFinalIncomeTaxRepoParams,
} from "@/features/accounting/domain/repositories/final-income-tax-settle";
import { FinalIncomeTaxSettleService } from "@/features/accounting/domain/sources/final-income-tax-settle";

export class FinalIncomeTaxSettleRepositoryImpl implements FinalIncomeTaxSettleRepository {
  constructor(private readonly service: FinalIncomeTaxSettleService) {}

  public async settle(
    params: SettleFinalIncomeTaxRepoParams,
    session: SessionEntity,
  ): Promise<DataState<JournalEntity>> {
    try {
      const model = await this.service.settle(params, session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
