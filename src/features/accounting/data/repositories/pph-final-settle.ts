import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";
import { PphFinalSettleRepository, SettlePphFinalRepoParams } from "@/features/accounting/domain/repositories/pph-final-settle";
import { PphFinalSettleService } from "@/features/accounting/domain/sources/pph-final-settle";

export class PphFinalSettleRepositoryImpl implements PphFinalSettleRepository {
  constructor(private readonly service: PphFinalSettleService) {}

  public async settle(params: SettlePphFinalRepoParams, session: SessionEntity): Promise<DataState<JournalEntity>> {
    try {
      const model = await this.service.settle(params, session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
