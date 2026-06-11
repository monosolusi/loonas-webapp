import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ProductionPreviewEntity } from "@/features/production/domain/entities/production-preview";
import { ProductionPreviewRepository } from "@/features/production/domain/repositories/production-preview";

type PreviewProductionInput = {
  productId: string;
  variantId: string;
  quantity: number;
};

export class PreviewProductionUseCaseParams {
  constructor(public readonly params: PreviewProductionInput) {}
}

export class PreviewProductionUseCase
  implements UseCase<DataState<ProductionPreviewEntity>, PreviewProductionUseCaseParams>
{
  constructor(
    private readonly productionPreviewRepository: ProductionPreviewRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: PreviewProductionUseCaseParams): Promise<DataState<ProductionPreviewEntity>> {
    try {
      const session = await this.resolveSession();
      return await this.productionPreviewRepository.preview(params.params, session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }
}
