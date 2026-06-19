import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { OpeningBalanceRepository } from "@/features/accounting/domain/repositories/opening-balance";
import { OpeningBalanceEntity } from "@/features/accounting/domain/entities/opening-balance";
import { OpeningBalanceService } from "@/features/accounting/domain/sources/opening-balance";

export class OpeningBalanceRepositoryImpl implements OpeningBalanceRepository {
  constructor(private readonly service: OpeningBalanceService) {}

  public async get(session: SessionEntity): Promise<DataState<OpeningBalanceEntity | null>> {
    try {
      const model = await this.service.get(session);
      if (model === null) return new DataSuccess(null);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
