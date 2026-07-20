import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ManagerialCostProjectionEntity } from "@/features/accounting/domain/entities/managerial-cost-projection";
import { ManagerialCostAllocationResultEntity } from "@/features/accounting/domain/entities/managerial-cost-allocation-result";
import {
  ManagerialCostRepository,
  GetManagerialCostParams,
  AllocateManagerialCostParams,
} from "@/features/accounting/domain/repositories/managerial-cost";
import { ManagerialCostService } from "@/features/accounting/domain/sources/managerial-cost";

export class ManagerialCostRepositoryImpl implements ManagerialCostRepository {
  constructor(private readonly service: ManagerialCostService) {}

  public async getProjection(
    params: GetManagerialCostParams,
    session: SessionEntity,
  ): Promise<DataState<ManagerialCostProjectionEntity[]>> {
    try {
      const models = await this.service.getProjection(params, session);
      return new DataSuccess(models.map((m) => m.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async allocate(
    params: AllocateManagerialCostParams,
    session: SessionEntity,
  ): Promise<DataState<ManagerialCostAllocationResultEntity>> {
    try {
      const model = await this.service.allocate(params, session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
