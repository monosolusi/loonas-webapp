import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductionPreviewEntity } from "@/features/production/domain/entities/production-preview";
import { ProductionPreviewRepository, PreviewProductionParams } from "@/features/production/domain/repositories/production-preview";
import { ProductionPreviewService } from "@/features/production/domain/sources/production-preview";

export class ProductionPreviewRepositoryImpl implements ProductionPreviewRepository {
  constructor(private readonly service: ProductionPreviewService) {}

  public async preview(
    params: PreviewProductionParams,
    session: SessionEntity,
  ): Promise<DataState<ProductionPreviewEntity>> {
    try {
      const result = await this.service.preview(params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
