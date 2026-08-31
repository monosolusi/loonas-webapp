import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { BalanceEntity } from "@/features/balance/domain/entities/balance";
import { BalanceRepository } from "@/features/balance/domain/repositories/balance";
import { BalanceService } from "@/features/balance/domain/sources/balance";

export class BalanceRepositoryImpl implements BalanceRepository {
  constructor(private readonly service: BalanceService) {}

  public async get(session: SessionEntity): Promise<DataState<BalanceEntity>> {
    try {
      const result = await this.service.get(session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
