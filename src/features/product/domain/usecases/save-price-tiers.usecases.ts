import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PriceTierScheduleEntity } from "@/features/product/domain/entities/price-tier-schedule";
import { PriceTierRepository } from "@/features/product/domain/repositories/price-tier";
import { TierModeType } from "@/features/product/domain/enums/tier-mode";

export type SavePriceTiersUseCaseTier = {
  minQty: number;
  unitPrice: number;
};

export class SavePriceTiersUseCaseParams {
  constructor(
    public readonly productId: string,
    public readonly variantId: string,
    public readonly tierMode: TierModeType,
    /** The complete intended schedule. Empty clears it; this is a write, not a no-op. */
    public readonly tiers: SavePriceTiersUseCaseTier[],
  ) {}
}

export class SavePriceTiersUseCase implements UseCase<DataState<PriceTierScheduleEntity>, SavePriceTiersUseCaseParams> {
  constructor(
    private readonly priceTierRepository: PriceTierRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: SavePriceTiersUseCaseParams): Promise<DataState<PriceTierScheduleEntity>> {
    try {
      const session = await this.resolveSession();
      return this.priceTierRepository.save(
        {
          productId: params.productId,
          variantId: params.variantId,
          tierMode: params.tierMode,
          tiers: params.tiers.map((tier) => ({ minQty: tier.minQty, unitPrice: tier.unitPrice })),
        },
        session,
      );
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
