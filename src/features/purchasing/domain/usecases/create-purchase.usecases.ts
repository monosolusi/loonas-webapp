import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { PurchaseEntity } from "@/features/purchasing/domain/entities/purchase";
import { PurchaseRepository } from "@/features/purchasing/domain/repositories/purchase";

type CreatePurchaseItemInput = {
  rawMaterialId?: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
};

type CreatePurchaseInput = {
  date: string;
  note?: string;
  items: CreatePurchaseItemInput[];
};

export class CreatePurchaseUseCaseParams {
  constructor(public readonly params: CreatePurchaseInput) {}
}

export class CreatePurchaseUseCase implements UseCase<DataState<PurchaseEntity>, CreatePurchaseUseCaseParams> {
  constructor(
    private readonly purchaseRepository: PurchaseRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: CreatePurchaseUseCaseParams): Promise<DataState<PurchaseEntity>> {
    try {
      const session = await this.resolveSession();
      return await this.purchaseRepository.create(params.params, session);
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
