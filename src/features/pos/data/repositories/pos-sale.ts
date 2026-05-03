import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";
import {
  CreatePosSaleParams,
  GetPosSaleParams,
  PosSaleRepository,
} from "@/features/pos/domain/repositories/pos-sale";
import { PosSaleService } from "@/features/pos/domain/sources/pos-sale";

export class PosSaleRepositoryImpl implements PosSaleRepository {
  constructor(private readonly service: PosSaleService) {}

  public async create(params: CreatePosSaleParams, session: SessionEntity): Promise<DataState<PosSaleEntity>> {
    try {
      const result = await this.service.create(params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async get(params: GetPosSaleParams, session: SessionEntity): Promise<DataState<PosSaleEntity>> {
    try {
      const result = await this.service.get(params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
