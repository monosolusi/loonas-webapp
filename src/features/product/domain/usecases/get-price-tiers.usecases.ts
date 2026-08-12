import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PriceTierScheduleEntity } from "@/features/product/domain/entities/price-tier-schedule";
import { PriceTierRepository } from "@/features/product/domain/repositories/price-tier";

export class GetPriceTiersUseCaseParams {
  constructor(
    public readonly productId: string,
    public readonly variantId: string,
  ) {}
}

export class GetPriceTiersUseCase implements UseCase<DataState<PriceTierScheduleEntity>, GetPriceTiersUseCaseParams> {
  constructor(
    private readonly priceTierRepository: PriceTierRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: GetPriceTiersUseCaseParams): Promise<DataState<PriceTierScheduleEntity>> {
    try {
      const session = await this.resolveSession();
      return this.priceTierRepository.get({ productId: params.productId, variantId: params.variantId }, session);
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
