// Canonical example: create operation use case.
// Source: src/features/production/domain/usecases/create-production-record.usecases.ts

import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ProductionRecordEntity } from "@/features/production/domain/entities/production-record";
import { ProductionRecordRepository } from "@/features/production/domain/repositories/production-record";

// Own input type — independent of repository params.
type CreateProductionRecordInput = {
  productId: string;
  variantId: string;
  quantity: number;
  producedAt?: string;
  note?: string;
};

export class CreateProductionRecordUseCaseParams {
  constructor(public readonly params: CreateProductionRecordInput) {}
}

export class CreateProductionRecordUseCase
  implements UseCase<DataState<ProductionRecordEntity>, CreateProductionRecordUseCaseParams>
{
  constructor(
    private readonly productionRecordRepository: ProductionRecordRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: CreateProductionRecordUseCaseParams): Promise<DataState<ProductionRecordEntity>> {
    try {
      const session = await this.resolveSession();
      return await this.productionRecordRepository.create(params.params, session);
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
