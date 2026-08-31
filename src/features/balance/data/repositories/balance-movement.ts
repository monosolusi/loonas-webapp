import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { BalanceMovementEntity } from "@/features/balance/domain/entities/balance-movement";
import {
  BalanceMovementRepository,
  ListBalanceMovementsParams,
} from "@/features/balance/domain/repositories/balance-movement";
import { BalanceMovementService } from "@/features/balance/domain/sources/balance-movement";

export class BalanceMovementRepositoryImpl implements BalanceMovementRepository {
  constructor(private readonly service: BalanceMovementService) {}

  public async list(
    params: ListBalanceMovementsParams,
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<BalanceMovementEntity>>> {
    try {
      const result = await this.service.list(params, session);
      return new DataSuccess({
        data: result.data.map((m) => m.toEntity()),
        meta: result.meta,
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
