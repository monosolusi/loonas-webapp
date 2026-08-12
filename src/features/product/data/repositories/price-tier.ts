import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PriceTierScheduleEntity } from "@/features/product/domain/entities/price-tier-schedule";
import { PriceTierCopyResultEntity } from "@/features/product/domain/entities/price-tier-copy-result";
import {
  PriceTierRepository,
  GetPriceTiersParams,
  SavePriceTiersParams,
  CopyPriceTiersParams,
} from "@/features/product/domain/repositories/price-tier";
import { PriceTierService } from "@/features/product/domain/sources/price-tier";

export class PriceTierRepositoryImpl implements PriceTierRepository {
  constructor(private readonly service: PriceTierService) {}

  public async get(
    params: GetPriceTiersParams,
    session: SessionEntity,
  ): Promise<DataState<PriceTierScheduleEntity>> {
    try {
      const result = await this.service.get(params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async save(
    params: SavePriceTiersParams,
    session: SessionEntity,
  ): Promise<DataState<PriceTierScheduleEntity>> {
    try {
      const result = await this.service.save(params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async copyToVariants(
    params: CopyPriceTiersParams,
    session: SessionEntity,
  ): Promise<DataState<PriceTierCopyResultEntity>> {
    try {
      const result = await this.service.copyToVariants(params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
